import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Define which routes are PUBLIC (Anyone can see these without being logged in)
const isPublicRoute = createRouteMatcher([
  "/", 
  "/api/mpesa/(.*)", // Matches stk-push and callback
  "/onboarding",
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

// 2. Define which routes are PROTECTED (Requires login and terms acceptance)
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)", 
  "/exposure(.*)", 
  "/leads(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // CRITICAL: If the route is public, return immediately.
  // This prevents Clerk from forcing a "Verify Email" or "Sign In" popup 
  // when a user just wants to click a pricing button.
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 3. Handle Protected Routes
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth();

    // Force login if not authenticated
    if (!userId) {
      await auth.protect();
      return;
    }

    // 4. Onboarding/Terms Check
    const metadata = sessionClaims?.metadata as { termsAccepted?: boolean };
    
    if (!metadata?.termsAccepted && req.nextUrl.pathname !== "/onboarding") {
      const onboardingUrl = new URL("/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  // This matcher ensures the middleware runs for all pages and APIs
  // while ignoring static files (images, css, etc.)
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};