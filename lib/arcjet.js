import arcjet, { tokenBucket } from "@arcjet/next";

/**
 * Creates a pre-configured Arcjet instance with token bucket rate limiting.
 *
 * @param {Object} options
 * @param {number} options.refillRate  - tokens added per interval
 * @param {string} options.interval    - e.g. "1h", "1m"
 * @param {number} options.capacity    - max burst size
 */
export function createRateLimiter({ refillRate, interval, capacity }) {
  return arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["userId"], // fingerprint by Clerk user ID, not IP
    rules: [
      tokenBucket({
        mode: "LIVE",
        refillRate,
        interval,
        capacity,
      }),
    ],
  });
}

/**
 * Runs an Arcjet decision and returns an error string if denied, null if allowed.
 * userId is the Clerk user ID — passed as the fingerprint characteristic.
 *
 * Never throws: the Arcjet `request()` context is unreliable inside Next.js
 * server actions on serverless (Vercel) and would otherwise crash the action
 * with an opaque "Server Components render" error. If the context is
 * unavailable, we skip rate limiting rather than block the request.
 *
 * @param {import("@arcjet/next").ArcjetInstance} aj
 * @param {Request | null} req
 * @param {string} userId
 * @returns {Promise<string|null>}
 */
export async function checkRateLimit(aj, req, userId) {
  if (!req) return null;
  try {
    const decision = await aj.protect(req, { userId, requested: 1 });
    if (decision.isDenied()) {
      return decision.reason.isRateLimit()
        ? "Too many requests. Please try again later."
        : "Request blocked.";
    }
  } catch (err) {
    console.warn("Arcjet rate limit check skipped:", err?.message || err);
  }
  return null;
}
