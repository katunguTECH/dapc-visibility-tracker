// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const clerkId = "test_clerk_user_123"; // replace with your real Clerk user ID if you want

  // Create user
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: "test@dapc.com",
      name: "Test User",
    },
  });

  // Create business
  const business = await prisma.business.upsert({
    where: { slug: "test-business" },
    update: {},
    create: {
      name: "Test Business",
      slug: "test-business",
      ownerId: user.id,
    },
  });

  // Link user to business
  await prisma.businessUser.upsert({
    where: {
      id: `${user.id}-${business.id}`,
    },
    update: {},
    create: {
      id: `${user.id}-${business.id}`,
      userId: user.id,
      businessId: business.id,
      role: "owner",
    },
  });

  // Create fake active subscription
  await prisma.subscription.upsert({
    where: { stripeId: "sub_test_123" },
    update: {},
    create: {
      stripeId: "sub_test_123",
      businessId: business.id,
      status: "active",
      priceId: "price_test_123",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });