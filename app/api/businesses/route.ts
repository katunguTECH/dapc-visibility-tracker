// app/api/businesses/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Clerk auth (NO arguments)
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch businesses where user is a member
    const memberships = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        business: true,
      },
    });

    const businesses = memberships.map((m) => ({
      id: m.business.id,
      name: m.business.name,
      slug: m.business.slug,
      subscriptionStatus: m.business.subscriptionStatus,
    }));

    return NextResponse.json({ businesses });
  } catch (error) {
    console.error("Businesses Route Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}