import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate that the body has the expected M-Pesa structure
    if (!body?.Body?.stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid body" }, { status: 400 });
    }

    const callbackData = body.Body.stkCallback;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = callbackData;

    console.log(`Processing M-Pesa Callback for CheckoutID: ${CheckoutRequestID}`);

    // Find the pending transaction in your SQLite/Dev database
    const transaction = await prisma.transaction.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!transaction) {
      console.error("Transaction not found for CheckoutRequestID:", CheckoutRequestID);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Transaction not found" });
    }

    if (ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item;
      
      const amount = metadata.find((item: any) => item.Name === "Amount")?.Value;
      const receipt = metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;

      // 1. Update Transaction to COMPLETED
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "COMPLETED",
          mpesaReceipt: receipt,
          resultDesc: ResultDesc,
        },
      });

      // 2. Upsert the Subscription to ACTIVE
      await prisma.subscription.upsert({
        where: { userId: transaction.userId },
        update: {
          status: "ACTIVE",
          plan: "PRO",
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        create: {
          userId: transaction.userId,
          status: "ACTIVE",
          plan: "PRO",
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });

      console.log(`✅ Payment Success: ${receipt}`);
    } else {
      // Handle Cancelled or Failed transactions
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "FAILED",
          resultDesc: ResultDesc,
        },
      });
      console.log(`❌ Payment Failed: ${ResultDesc}`);
    }

    // Safaricom requires a 200 OK with this specific JSON format
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error) {
    console.error("M-Pesa Callback Webhook Error:", error);
    // Still return 200 to Safaricom to prevent them from retrying indefinitely
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}