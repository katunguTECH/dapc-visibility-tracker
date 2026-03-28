import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; // Ensure this path is 100% correct
import axios from "axios";

async function getMpesaToken() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${authHeader}` } }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Token Generation Failed");
    throw new Error("M-Pesa Token Error");
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { amount, phoneNumber, planName } = body;

    // Check if prisma is defined before moving forward
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 1. Initiate STK Push
    const mpesaResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)), 
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: planName.replace(/\s/g, ""), 
        TransactionDesc: `DAPC ${planName}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 2. Save to DB
    // Use the lowercase 'prisma' imported from your lib
    await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        phoneNumber,
        plan: planName,
        checkoutRequestId: mpesaResponse.data.CheckoutRequestID,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, message: "STK Push Sent" });

  } catch (error: any) {
    console.error("DETAILED_STK_ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}