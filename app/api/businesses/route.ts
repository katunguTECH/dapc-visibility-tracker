import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const memberships = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        business: true,
      },
    });

    const businesses = memberships.map(
      (m: Prisma.MembershipGetPayload<{ include: { business: true } }>) => ({
        id: m.business.id,
        name: m.business.name,
        slug: m.business.slug,
        subscriptionStatus: m.business.subscriptionStatus,
      })
    );

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Businesses Route Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}