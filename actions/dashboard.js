"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import { createRateLimiter, checkRateLimit } from "@/lib/arcjet";
import { Resend } from "resend";
import { WithdrawalRequestEmail } from "@/emails/WithdrawalRequestEmail";
import { render } from "@react-email/render";
import { buildAppUrl } from "@/lib/url";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Lazy singleton — never constructed at import time, so `next build` succeeds
// even when RESEND_API_KEY isn't set (e.g. CI / deployment without the env
// var). Email sending is simply skipped and logged when the key is missing.
let resend = null;
const getResendClient = () => {
  if (resend) return resend;
  if (!process.env.RESEND_API_KEY) return null;
  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};

const withdrawalLimiter = createRateLimiter({
  refillRate: 1,
  interval: "1h",
  capacity: 3,
});

// ─── AVAILABILITY ─────────────────────────────────────────────────────────────

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const setAvailability = async ({ isActive = true, startTime, endTime }) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (typeof isActive !== "boolean") throw new Error("Invalid status");
  if (!startTime || !endTime) throw new Error("Start and end time required");
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime))
    throw new Error("Times must be in HH:mm format");
  if (startTime >= endTime)
    throw new Error("Start time must be before end time");

  try {
    await db.availability.upsert({
      where: { interviewerId: dbUser.id },
      update: { isActive, startTime, endTime },
      create: { interviewerId: dbUser.id, isActive, startTime, endTime },
    });

    revalidatePath("/dashboard");
    revalidatePath("/explore");
    return { success: true };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save availability");
  }
};

export const getAvailability = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser) throw new Error("User not found");

  return db.availability.findFirst({
    where: { interviewerId: dbUser.id },
  });
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export const getInterviewerAppointments = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser) throw new Error("User not found");

  return db.booking.findMany({
    where: { interviewerId: dbUser.id },
    include: {
      interviewee: { select: { name: true, imageUrl: true, email: true } },
      feedback: true,
    },
    orderBy: { startTime: "desc" },
  });
};

// ─── EARNINGS / WITHDRAWAL ────────────────────────────────────────────────────

export const getInterviewerStats = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    select: {
      creditBalance: true,
      creditRate: true,
      bookingsAsInterviewer: {
        where: { status: "COMPLETED" },
        select: { creditsCharged: true },
      },
    },
  });
  if (!dbUser) throw new Error("User not found");

  const totalEarned = dbUser.bookingsAsInterviewer.reduce(
    (sum, b) => sum + b.creditsCharged,
    0
  );

  return {
    creditBalance: dbUser.creditBalance,
    creditRate: dbUser.creditRate,
    totalEarned,
    completedSessions: dbUser.bookingsAsInterviewer.length,
  };
};

// Assignment
export const requestWithdrawal = async ({
  credits,
  paymentMethod,
  paymentDetail,
}) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const req = await request();
  const rateLimitError = await checkRateLimit(withdrawalLimiter, req, user.id);
  if (rateLimitError) throw new Error(rateLimitError);

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser || dbUser.role !== "INTERVIEWER") throw new Error("Forbidden");

  if (!credits || credits <= 0) throw new Error("Invalid credit amount");
  if (credits > dbUser.creditBalance)
    throw new Error("Insufficient credit balance");
  if (!paymentMethod || !paymentDetail)
    throw new Error("Payment details required");

  const PLATFORM_FEE = 0.2;
  const netAmount = credits * (1 - PLATFORM_FEE) * 5;
  const platformFee = credits * PLATFORM_FEE * 5;

  try {
    const [payout] = await db.$transaction([
      db.payout.create({
        data: {
          interviewerId: dbUser.id,
          credits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          status: "PROCESSING",
        },
      }),
      db.user.update({
        where: { id: dbUser.id },
        data: { creditBalance: { decrement: credits } },
      }),
    ]);

    // Fire admin email — non-blocking, failure won't affect the user
    try {
      const resendClient = getResendClient();
      if (!resendClient) {
        console.error(
          "Withdrawal email skipped: RESEND_API_KEY is not set in this environment"
        );
      } else {
        const reviewUrl = buildAppUrl(`/payout/${payout.id}`);
        const html = await render(
          WithdrawalRequestEmail({
            interviewerName: dbUser.name ?? "Unknown",
            interviewerEmail: dbUser.email,
            credits,
            platformFee,
            netAmount,
            paymentMethod,
            paymentDetail,
            reviewUrl,
          })
        );
        await resendClient.emails.send({
          from: "Prept <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          subject: `Withdrawal Request — ${dbUser.name} · ${credits} credits`,
          html,
        });
      }
    } catch (emailErr) {
      console.error("Withdrawal email failed:", emailErr);
    }

    revalidatePath("/dashboard");
    return { success: true, netAmount };
  } catch (err) {
    console.error(err);
    throw new Error("Withdrawal request failed");
  }
};

export const getWithdrawalHistory = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser) throw new Error("User not found");

  return db.payout.findMany({
    where: { interviewerId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });
};
