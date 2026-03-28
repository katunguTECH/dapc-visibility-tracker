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
    const { CheckoutRequestID, ResultCode, ResultDesc } = callbackData;

    console.log(`Processing M-Pesa Callback for CheckoutID: ${CheckoutRequestID}`);

    // Find the pending transaction
    // Ensure your Transaction model includes 'plan' (e.g., "STARTER", "GROWTH")
    const transaction = await prisma.transaction.findUnique({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!transaction) {
      console.error("Transaction not found for CheckoutRequestID:", CheckoutRequestID);
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Transaction not found" });
    }

    if (ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata.Item;
      
      const receipt = metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
      const amountPaid = metadata.find((item: any) => item.Name === "Amount")?.Value;

      // 1. Update Transaction to COMPLETED
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "COMPLETED",
          mpesaReceipt: receipt,
          resultDesc: ResultDesc,
        },
      });

      // 2. Upsert the Subscription based on the plan selected during checkout
      // We use the 'plan' from the transaction record (e.g., "GROWTH_ENGINE")
      const planName = transaction.plan || "STARTER"; 

      await prisma.subscription.upsert({
        where: { userId: transaction.userId },
        update: {
          status: "ACTIVE",
          plan: planName,
          amount: amountPaid,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
        create: {
          userId: transaction.userId,
          status: "ACTIVE",
          plan: planName,
          amount: amountPaid,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });

      console.log(`✅ Payment Success: ${receipt} for Plan: ${planName}`);
    } else {
      // Handle Cancelled (1032) or Failed transactions
      await prisma.transaction.update({
        where: { checkoutRequestId: CheckoutRequestID },
        data: {
          status: "FAILED",
          resultDesc: ResultDesc,
        },
      });
      console.log(`❌ Payment Failed/Cancelled: ${ResultDesc}`);
    }

    // Safaricom requires this specific JSON format
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });

  } catch (error) {
    console.error("M-Pesa Callback Webhook Error:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal Error" });
  }
}