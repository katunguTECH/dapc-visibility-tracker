// src/middleware.ts

// ONLY these routes are free to see without an account
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/visibility(.*)' 
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // This will catch anyone trying to go to /leads or /exposure
    const authObject = await auth();
    if (!authObject.userId) {
      return authObject.redirectToSignIn();
    }
  }
});