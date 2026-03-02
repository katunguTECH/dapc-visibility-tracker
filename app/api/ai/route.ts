import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Modern Type Inference: 
 * We define the type by looking at what findMany returns when including 'business'.
 * This avoids the 'MembershipGetPayload' error.
 */
type MembershipWithBusiness = Prisma.PromiseReturnType<typeof getMemberships>[number];

// Helper function to help TypeScript infer the return type
async function getMemberships(userId: string) {
  return await prisma.membership.findMany({
    where: { userId },
    include: { business: true },
  });
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const memberships = await getMemberships(userId);

    // Explicitly mapping the data to the format the frontend expects
    const businesses = memberships.map((m: MembershipWithBusiness) => {
      // Safety check: Ensure business exists to prevent runtime crashes
      if (!m.business) return null;

      return {
        id: m.business.id,
        name: m.business.name,
        slug: m.business.slug,
        createdAt: m.business.createdAt,
        updatedAt: m.business.updatedAt,
      };
    }).filter(Boolean); // Removes any null entries if a business was missing

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Businesses API error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}