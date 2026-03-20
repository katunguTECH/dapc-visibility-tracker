import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes clearly
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/visibility(.*)'
]);

export default clerkMiddleware((auth, req) => {
  // If the route is not public, protect it
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // 1. Skip Next.js internals and all static files (images, favicon, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 2. Always run for API routes
    '/(api|trpc)(.*)',
  ],
};