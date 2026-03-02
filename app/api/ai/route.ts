import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * We use Prisma.PromiseReturnType to extract the exact shape of the 
 * BusinessUser including the nested business data.
 */
type BusinessUserWithBusiness = Prisma.PromiseReturnType<typeof getMemberships>[number];

async function getMemberships(userId: string) {
  // FIXED: Changed 'membership' to 'businessUser' to match your schema
  return await prisma.businessUser.findMany({
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

    // Map the results to the business details
    const businesses = memberships
      .map((m: BusinessUserWithBusiness) => {
        if (!m.business) return null;
        return {
          id: m.business.id,
          name: m.business.name,
          slug: m.business.slug,
          createdAt: m.business.createdAt,
          updatedAt: m.business.updatedAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Businesses API error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}