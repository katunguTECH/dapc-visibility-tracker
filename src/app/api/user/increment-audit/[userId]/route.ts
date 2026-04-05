import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    // Check if subscription exists
    let subscription = await prisma.subscription.findUnique({ where: { userId } });

    if (!subscription) {
      // Create a FREE subscription and mark it as used
      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: "FREE",
          status: "INACTIVE", // used free audit
          startDate: new Date(),
          endDate: new Date(),
        },
      });
    } else if (subscription.plan === "FREE" && subscription.status === "INACTIVE") {
      // Already marked as used, do nothing
      return NextResponse.json({ message: "Free audit already used" });
    }

    return NextResponse.json({ message: "Free audit recorded" });
  } catch (error) {
    console.error("Increment audit error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}