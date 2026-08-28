import arcjet, { detectBot, shield } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/appointments(.*)",
  "/explore(.*)",
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

const isWebhookRoute = createRouteMatcher([
  "/api/webhooks/stream(.*)",
]);

const aj = arcjet({
  key: process.env.ARCJET_KEY,

  rules: [
    shield({
      mode: "LIVE",
    }),

    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});


export default clerkMiddleware(async (auth, req) => {

  // Protect normal traffic. Arcjet is best-effort: if it fails or is
  // unreachable on the serverless runtime, fail OPEN so its errors can never
  // break a request or trigger the opaque "Server Components render" crash on
  // Vercel. Real users are still protected by Clerk auth below.
  if (!isWebhookRoute(req)) {
    try {
      const decision = await aj.protect(req);

      if (decision.isDenied()) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    } catch (err) {
      console.warn("Arcjet middleware check skipped:", err?.message || err);
    }
  }


  const { userId } = await auth();


  if (!userId && isProtectedRoute(req)) {

    const { redirectToSignIn } = await auth();

    return redirectToSignIn();
  }


  return NextResponse.next();
});


export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};