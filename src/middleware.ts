import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/mpesa/stk-push",   // ✅ VERY IMPORTANT
  "/api/mpesa/callback",   // (optional but recommended)
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
  ],
};