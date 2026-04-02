import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This matches the home page and the M-Pesa API
const isPublicRoute = createRouteMatcher(["/", "/api/mpesa/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // IF THE USER IS ON THE HOME PAGE, STOP CLERK IMMEDIATELY
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Only protect specific dashboard/app routes
  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/exposure(.*)"]);
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};