import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define exactly what is public
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/visibility(.*)' // Added wildcard to ensure the GET params are allowed
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // This is the correct way to protect routes in the latest Clerk SDK
    const authData = await auth();
    if (!authData.userId) {
      return authData.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, but allow API routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};