import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Explicitly type the result of the query
    const memberships: Prisma.MembershipGetPayload<{
      include: { business: true };
    }>[] = await prisma.membership.findMany({
      where: {
        userId,
      },
      include: {
        business: true,
      },
    });

    const businesses = memberships.map((m) => ({
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