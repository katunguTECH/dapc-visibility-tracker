import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // No subscription, allow 1 free audit
      return NextResponse.json({
        canAudit: true,
        message: "You have 1 free audit available!",
      });
    }

    // Check subscription status
    if (subscription.status === "ACTIVE") {
      return NextResponse.json({
        canAudit: true,
        message: "Your subscription is active. You can run unlimited audits!",
      });
    } else {
      // INACTIVE or EXPIRED
      return NextResponse.json({
        canAudit: false,
        message: "Your free audit has been used. Subscribe to run more audits.",
      });
    }
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}