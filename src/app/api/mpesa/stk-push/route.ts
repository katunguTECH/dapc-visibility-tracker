import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { amount, phoneNumber, planName } = body; // planName comes from our new Pricing Modal

    // ... OAuth Token Generation Logic ...
    const token = "YOUR_GENERATED_TOKEN"; 

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 1. INITIALIZE TRANSACTION IN DATABASE
    const transaction = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: planName, // We store the plan name here for M-Pesa records
        TransactionDesc: `DAPC ${planName} Subscription`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 2. SAVE TO PRISMA
    await prisma.transaction.create({
      data: {
        userId,
        amount,
        plan: planName, // This links the animal tier to the specific checkout ID
        checkoutRequestId: transaction.data.CheckoutRequestID,
        merchantRequestId: transaction.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, message: "Push sent!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}