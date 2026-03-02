import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// 1. Define the specific shape of the data we are fetching
// This tells TypeScript: "A membership MUST include the business relation"
type MembershipWithBusiness = Prisma.MembershipGetPayload<{
  include: { business: true };
}>;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Fetch the data
    const memberships = await prisma.membership.findMany({
      where: {
        userId,
      },
      include: {
        business: true,
      },
    });

    // 3. Map using the explicit type defined above
    const businesses = memberships.map((m: MembershipWithBusiness) => ({
      id: m.business.id,
      name: m.business.name,
      slug: m.business.slug,
      createdAt: m.business.createdAt,
      updatedAt: m.business.updatedAt,
    }));

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Businesses API error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}