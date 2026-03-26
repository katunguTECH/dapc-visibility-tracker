import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/exposure(.*)", "/leads(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 1. If user is signed in and trying to access protected routes
  if (userId && isProtectedRoute(req)) {
    const metadata = sessionClaims?.metadata as { termsAccepted?: boolean };
    
    // 2. Check if they have NOT accepted terms
    if (!metadata?.termsAccepted && req.nextUrl.pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }

  // 3. Normal protection for logged-out users
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};