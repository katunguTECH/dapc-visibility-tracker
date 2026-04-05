import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/mpesa/callback"
]);

export default clerkMiddleware(async (auth, request) => {
  // Skip public routes
  if (isPublicRoute(request)) return;

  // 1️⃣ Protect route (must be signed in)
  await auth.protect();

  const userId = auth.userId;
  if (!userId) throw new Error("Unauthorized");

  // 2️⃣ Check subscription + freemium usage
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscription: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // ✅ Allow if user has active subscription
  const isSubscribed = user.subscription?.status === "ACTIVE";

  // ✅ Allow if user still has free audit left
  const hasFreeAudit = user.auditCount < 1;

  if (!isSubscribed && !hasFreeAudit) {
    // 3️⃣ Block access if no subscription AND free audit used
    return new Response("Access denied. Please subscribe.", { status: 403 });
  }

  // 4️⃣ Optional: increment auditCount if accessing free route
  if (!isSubscribed && hasFreeAudit) {
    await prisma.user.update({
      where: { id: user.id },
      data: { auditCount: user.auditCount + 1 }
    });
  }

  // Access granted
});

export const config = {
  matcher: [
    // Protect all routes except public
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};