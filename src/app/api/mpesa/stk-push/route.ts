import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

/**
 * Helper: Generates the M-Pesa OAuth Access Token
 */
async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${authHeader}` } }
  );
  return response.data.access_token;
}

export async function POST(req: Request) {
  try {
    // 1. Clerk Authentication
    const { userId } = await auth(); 
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { amount, phoneNumber, planName } = body;

    // 2. DATA SANITIZATION (Fixes the 400 Error)
    // Convert 07... or +254... to 2547...
    let cleanPhone = phoneNumber.replace(/\+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.slice(1);
    }

    // Safaricom Reference rules: No spaces, max 12 characters
    const safeRef = planName.replace(/\s/g, "").substring(0, 12);

    // 3. Prepare M-Pesa Auth
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 4. Initiate STK Push
    const mpesaResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)), // Must be integer
        PartyA: cleanPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: cleanPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: safeRef, 
        TransactionDesc: `DAPC ${safeRef}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 5. Database Logging
    // This will work because your 'npx prisma db push' was successful
    await prisma.transaction.create({
      data: {
        userId: userId,
        amount: parseFloat(amount),
        phoneNumber: cleanPhone,
        plan: planName,
        checkoutRequestId: mpesaResponse.data.CheckoutRequestID,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "STK Push Sent. Check your phone for the PIN prompt." 
    });

  } catch (error: any) {
    // Log detailed response from Safaricom for debugging
    console.error("STK_PUSH_FAILED:", error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.errorMessage || "Safaricom rejected the request. Please check phone format." 
      },
      { status: 500 }
    );
  }
}