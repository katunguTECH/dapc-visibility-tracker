import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/api/mpesa/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // If user is on home page or using M-Pesa API, bypass all Clerk checks
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Only protect dashboard/exposure routes
  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/exposure(.*)"]);
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};