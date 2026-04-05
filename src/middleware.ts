import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that don't require auth
const publicRoutes = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/mpesa/callback",
]);

export default clerkMiddleware((auth, request) => {
  try {
    if (!publicRoutes(request)) {
      // Only protect if auth is loaded
      if (auth) return auth.protect();
      throw new Error("Auth not initialized");
    }
  } catch (err) {
    console.error("Middleware error:", err);
    return new Response("Unauthorized", { status: 401 });
  }
});

export const config = {
  matcher: [
    // Match all pages except Next.js internals and static assets
    "/((?!_next|.*\\.(?:css|js|png|jpg|jpeg|svg|ico)).*)",
    "/api/(.*)",
  ],
};