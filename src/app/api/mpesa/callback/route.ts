import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const callbackData = body.Body.stkCallback;
    const { CheckoutRequestID, ResultCode, ResultDesc } = callbackData;

    const transaction = await prisma.transaction.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!transaction) return NextResponse.json({ ResultCode: 1, ResultDesc: "Not found" });

    if (ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item;
      const receipt = metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;

      // 1. Update Transaction
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: { status: "COMPLETED", mpesaReceipt: receipt, resultDesc: ResultDesc },
      });

      // 2. Activate Subscription
      await prisma.subscription.upsert({
        where: { userId: transaction.userId },
        update: {
          status: "ACTIVE",
          plan: transaction.plan,
          amount: transaction.amount,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        create: {
          userId: transaction.userId,
          status: "ACTIVE",
          plan: transaction.plan,
          amount: transaction.amount,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    } else {
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: { status: "FAILED", resultDesc: ResultDesc },
      });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}