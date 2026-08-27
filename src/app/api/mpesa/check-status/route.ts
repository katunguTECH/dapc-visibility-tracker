import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkoutRequestId = searchParams.get("checkoutRequestId");
  if (!checkoutRequestId) return NextResponse.json({ status: "error" }, { status: 400 });

  const payment = await prisma.payment.findUnique({
    where: { checkoutId: checkoutRequestId },
    select: { status: true }
  });

  // If the status is COMPLETED, the modal stops spinning
  return NextResponse.json({ status: payment?.status || "PENDING" });
}