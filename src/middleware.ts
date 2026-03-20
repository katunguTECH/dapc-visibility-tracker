import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/visibility(.*)']);

export default clerkMiddleware(async (auth, request) => {
  const authObject = await auth(); // <--- Must await auth()
  if (!isPublicRoute(request)) {
    authObject.protect(); // <--- Now protect() will exist
  }
});