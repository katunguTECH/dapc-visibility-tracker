// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/exposure(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

// 👇 VERY IMPORTANT
export const config = {
  matcher: [
    /*
     * Run middleware on app routes only
     * Exclude static files and ALL API routes
     */
    "/((?!_next|.*\\..*|api).*)",
  ],
};