"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import { createRateLimiter, checkRateLimit } from "@/lib/arcjet";
import { getCreditPack } from "@/lib/credit-packs";

// 10 purchase completions per hour — blocks automated abuse without
// getting in the way of a customer retrying a failed payment
const purchaseLimiter = createRateLimiter({
  refillRate: 5,
  interval: "1h",
  capacity: 10,
});

/**
 * Finalizes a Chapa inline checkout: re-verifies the payment server-side
 * (the client callback alone is spoofable), then atomically grants credits.
 *
 * Called with the reference id + payment method the inline SDK reports
 * in onSuccessfulPayment(verifyResult, refId).
 */
export const completeChapaPurchase = async ({
  packId,
  refId,
  paymentMethod,
}) => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // ── Arcjet rate limit ────────────────────────────────────────────────────
    const req = await request();
    const rateLimitError = await checkRateLimit(purchaseLimiter, req, user.id);
    if (rateLimitError)
      return { success: false, error: rateLimitError };
    // ─────────────────────────────────────────────────────────────────────────

    const pack = getCreditPack(packId);
    if (!pack) return { success: false, error: "Invalid credit package" };
    if (!refId || typeof refId !== "string")
      return { success: false, error: "Missing payment reference" };

    // ── Authoritative verification with Chapa ───────────────────────────────
    // Same validate call the inline SDK makes, but executed server-side so a
    // forged client callback can never grant credits.
    const form = new FormData();
    form.append("reference", refId);
    form.append("payment_method", paymentMethod ?? "");

    const verifyRes = await fetch(
      "https://inline.chapaservices.net/v1/inline/validate",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAPA_PUBLIC_KEY}`,
        },
        body: form,
      }
    );
    const result = await verifyRes.json().catch(() => null);

    if (!result || result.status !== "success")
      return { success: false, error: "Payment could not be verified" };
    if (result.data?.status !== "success")
      return {
        success: false,
        error: "Payment was not completed. No credits were added.",
      };

    // Defense in depth: reject if Chapa reports an amount/currency/ref that
    // doesn't match what the pack costs (fields are optional on this endpoint)
    if (
      result.data.amount != null &&
      Number(result.data.amount) !== Number(pack.price)
    )
      return { success: false, error: "Payment amount mismatch" };
    if (
      result.data.currency != null &&
      result.data.currency !== "ETB"
    )
      return { success: false, error: "Unexpected payment currency" };
    if (
      typeof result.data.tx_ref === "string" &&
      !result.data.tx_ref.startsWith("prept-")
    )
      return { success: false, error: "Unrecognized transaction reference" };

    // ── Grant credits atomically ─────────────────────────────────────────────
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: { id: true, role: true, credits: true },
    });
    if (!dbUser)
      return { success: false, error: "Account not found. Finish onboarding first." };
    if (dbUser.role !== "INTERVIEWEE")
      return {
        success: false,
        error: "Only interviewee accounts can purchase credit packs",
      };

    await db.$transaction(async (tx) => {
      await tx.creditTransaction.create({
        data: {
          userId: dbUser.id,
          amount: pack.credits,
          type: "CREDIT_PURCHASE",
        },
      });
      await tx.user.update({
        where: { id: dbUser.id },
        data: { credits: { increment: pack.credits } },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/appointments");

    return {
      success: true,
      credits: pack.credits,
      balance: dbUser.credits + pack.credits,
    };
  } catch (err) {
    console.error("completeChapaPurchase error:", err);
    return {
      success: false,
      error:
        "Failed to finalize your purchase. If you were charged, contact support.",
    };
  }
};
