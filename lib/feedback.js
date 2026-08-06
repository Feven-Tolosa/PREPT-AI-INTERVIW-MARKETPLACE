// Shared AI feedback pipeline used by the Stream webhook (automatic) and the
// on-demand generateFeedbackReport action (manual trigger after a call).
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StreamClient } from "@stream-io/node-sdk";
import { db } from "@/lib/prisma";

export const FEEDBACK_MODEL = "gemini-2.0-flash";

// ─── Sanitization ─────────────────────────────────────────────────────────────
// AI output is sanitized so malformed fields never break the DB write.

const clamp = (n, min = 1, max = 10) =>
  Number.isInteger(n) ? Math.min(max, Math.max(min, n)) : null;

const toStringArray = (arr, limit = 10) =>
  Array.isArray(arr)
    ? arr.filter((s) => typeof s === "string" && s.trim()).slice(0, limit)
    : [];

const toQuestionBreakdown = (arr) =>
  Array.isArray(arr)
    ? arr
      .filter((q) => q && typeof q === "object" && q.question)
      .map((q) => ({
        question: String(q.question),
        verdict: ["STRONG", "ADEQUATE", "WEAK"].includes(q.verdict)
          ? q.verdict
          : "ADEQUATE",
        notes: typeof q.notes === "string" ? q.notes : "",
      }))
      .slice(0, 12)
    : [];

export function sanitizeFeedback(data) {
  return {
    summary: typeof data?.summary === "string" ? data.summary : "",
    technical: typeof data?.technical === "string" ? data.technical : "",
    communication:
      typeof data?.communication === "string" ? data.communication : "",
    problemSolving:
      typeof data?.problemSolving === "string" ? data.problemSolving : "",
    technicalScore: clamp(data?.technicalScore),
    communicationScore: clamp(data?.communicationScore),
    problemSolvingScore: clamp(data?.problemSolvingScore),
    recommendation:
      typeof data?.recommendation === "string" ? data.recommendation : "",
    strengths: toStringArray(data?.strengths),
    improvements: toStringArray(data?.improvements),
    conceptsCovered: toStringArray(data?.conceptsCovered, 20),
    pace: typeof data?.pace === "string" ? data.pace : "",
    nextSteps: toStringArray(data?.nextSteps),
    questionBreakdown: toQuestionBreakdown(data?.questionBreakdown),
    overallRating: data?.overallRating,
  };
}

// ─── Gemini generation ────────────────────────────────────────────────────────

function buildPrompt(transcript, interviewer, interviewee) {
  const categories = interviewer.categories?.join(", ") ?? "General";

  return `You are an expert technical interviewer evaluating a mock interview.

Interview categories: ${categories}
Interviewer: ${interviewer.name}
Candidate: ${interviewee.name}

TRANSCRIPT:
${transcript}

Analyze the candidate's performance. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "summary": "2-3 sentence overall summary of the session",
  "technical": "Assessment of technical knowledge and accuracy",
  "communication": "Assessment of clarity, structure, and communication style",
  "problemSolving": "Assessment of problem-solving approach and thought process",
  "technicalScore": 7,
  "communicationScore": 8,
  "problemSolvingScore": 6,
  "recommendation": "HIRE / CONSIDER / NO_HIRE with a one-sentence reason",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "conceptsCovered": ["React hooks", "closures", "event loop", "system design"],
  "pace": "Brief assessment of the candidate's pacing, timing, and time management during the session",
  "nextSteps": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "questionBreakdown": [
    { "question": "key question asked in the interview", "verdict": "STRONG or ADEQUATE or WEAK", "notes": "one-sentence assessment of the answer" }
  ],
  "overallRating": "POOR or AVERAGE or GOOD or EXCELLENT"
}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Pulls the `retryDelay` (e.g. "52s") Google attaches to 429 responses.
const getRetryDelayMs = (err) => {
  const match = String(err?.message ?? "").match(
    /retryDelay["']?\s*[:=]\s*["']?(\d+(?:\.\d+)?)s/
  );
  return match ? Math.ceil(parseFloat(match[1]) * 1000) : 30_000;
};

export async function generateFeedback(transcript, interviewer, interviewee) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: FEEDBACK_MODEL });

  const prompt = buildPrompt(transcript, interviewer, interviewee);

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response
        .text()
        .trim()
        .replace(/^```json|^```|```$/gm, "")
        .trim();

      return sanitizeFeedback(JSON.parse(raw));
    } catch (err) {
      lastError = err;
      const isRateLimit =
        err?.status === 429 ||
        /429|quota|rate limit/i.test(String(err?.message ?? ""));
      if (!isRateLimit || attempt === 3) break;
      await sleep(getRetryDelayMs(err));
    }
  }

  throw new Error(
    "The AI report service is temporarily rate-limited. Please try again in a minute."
  );
}

// ─── Stream transcript ────────────────────────────────────────────────────────

export async function fetchStreamTranscript(streamCallId) {
  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_SECRET_KEY || process.env.STREAM_API_SECRET,
    { timeout: 30_000 }
  );

  const { transcriptions } = await streamClient.video
    .call("default", streamCallId)
    .listTranscriptions();
  const transcript = transcriptions?.[0];
  if (!transcript?.url) return null;

  const res = await fetch(transcript.url);
  if (!res.ok) return null;
  return await res.text();
}

// ─── Transcript parsing ───────────────────────────────────────────────────────

// Parses the JSONL transcript from Stream into a readable conversation.
// Returns null when there are no speech segments.
export function parseTranscript(text, speakerMap) {
  const lines = (text ?? "")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((entry) => entry?.type === "speech");

  if (lines.length === 0) return null;

  return lines
    .map((l) => `${speakerMap[l.speaker_id] ?? l.speaker_id}: ${l.text}`)
    .join("\n");
}

// ─── DB write ─────────────────────────────────────────────────────────────────

// Writes the AI report, marks the booking COMPLETED and credits the interviewer.
// The credit transaction is guarded so retries never double-pay.
export async function saveFeedbackForBooking(booking, feedbackData) {
  await db.$transaction([
    db.feedback.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        ...feedbackData,
      },
      update: {}, // already exists — no-op, keep the original
    }),
    db.booking.update({
      where: { id: booking.id },
      data: { status: "COMPLETED" },
    }),
  ]);

  const earnExists = await db.creditTransaction.findFirst({
    where: { bookingId: booking.id, type: "BOOKING_EARNING" },
  });
  if (!earnExists) {
    await db.creditTransaction.create({
      data: {
        userId: booking.interviewer.id,
        amount: booking.creditsCharged,
        type: "BOOKING_EARNING",
        bookingId: booking.id,
      },
    });
  }
}
