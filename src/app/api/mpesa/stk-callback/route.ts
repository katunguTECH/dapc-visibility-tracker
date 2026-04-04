// src/app/api/mpesa/stk-callback/route.ts
import { NextRequest, NextResponse } from "next/server";

// This endpoint is called by Safaricom when the STK Push payment completes
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // M-Pesa callback contains the result of the transaction
    const result = data.Body?.stkCallback;

    if (!result) {
      console.error("Invalid callback payload", data);
      return NextResponse.json({ message: "Invalid callback payload" }, { status: 400 });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = result;

    console.log("STK Callback Received:", result);

    // ResultCode 0 means successful payment
    if (ResultCode === 0) {
      // Extract payment info from CallbackMetadata
      const items = CallbackMetadata?.Item || [];
      const amountItem = items.find((i: any) => i.Name === "Amount");
      const mpesaReceiptItem = items.find((i: any) => i.Name === "MpesaReceiptNumber");
      const phoneItem = items.find((i: any) => i.Name === "PhoneNumber");

      const amount = amountItem?.Value;
      const receipt = mpesaReceiptItem?.Value;
      const phoneNumber = phoneItem?.Value;

      console.log(`Payment successful! Phone: ${phoneNumber}, Amount: ${amount}, Receipt: ${receipt}`);

      // TODO: Update your database to mark the subscription as paid
      // e.g., update user where phoneNumber = phoneNumber with amount, receipt, plan info

      return NextResponse.json({ message: "Payment confirmed" });
    } else {
      console.warn(`Payment failed: ${ResultDesc} (ResultCode: ${ResultCode})`);
      return NextResponse.json({ message: `Payment failed: ${ResultDesc}` });
    }
  } catch (err: any) {
    console.error("STK Callback Error:", err);
    return NextResponse.json({ message: "Callback processing failed" }, { status: 500 });
  }
}