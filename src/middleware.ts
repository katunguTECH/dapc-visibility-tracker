import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define what is PROTECTED
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/exposure(.*)", "/leads(.*)"]);

// 2. Define what is PUBLIC (Home and M-Pesa API)
const isPublicRoute = createRouteMatcher([
  "/", 
  "/api/mpesa/stk-push", 
  "/api/mpesa/callback",
  "/onboarding"
]);

export default clerkMiddleware(async (auth, req) => {
  // If it's a public route, don't even run the auth logic
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  // 3. Handle protected routes
  if (isProtectedRoute(req)) {
    // Force login if not authenticated
    if (!userId) {
      await auth.protect();
      return;
    }

    const metadata = sessionClaims?.metadata as { termsAccepted?: boolean };
    
    // 4. Onboarding check
    if (!metadata?.termsAccepted && req.nextUrl.pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};