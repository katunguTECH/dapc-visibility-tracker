import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",                        // homepage
  "/api/mpesa/stk-push",     // ✅ allow payments
  "/api/mpesa/callback",     // (optional but recommended)
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