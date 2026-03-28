import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = body.Body.stkCallback;

    console.log(`M-Pesa Callback Received for: ${CheckoutRequestID}`);

    if (ResultCode === 0) {
      // Payment Successful
      const amount = CallbackMetadata.Item.find((item: any) => item.Name === "Amount")?.Value;
      const mpesaReceipt = CallbackMetadata.Item.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;

      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "COMPLETED",
          mpesaReceiptNumber: mpesaReceipt,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ message: "Success" });
    } else {
      // Payment Failed or Cancelled
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "FAILED",
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ message: "Cancelled" });
    }
  } catch (error: any) {
    console.error("CALLBACK_ERROR:", error.message);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}