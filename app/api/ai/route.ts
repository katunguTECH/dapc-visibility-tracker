import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch memberships including related business
    const memberships = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        business: true,
      },
    });

    // Let TypeScript infer the type automatically
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