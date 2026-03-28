import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; // Ensure this matches your src/lib/prisma.ts export
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
    // 1. Verify User Session with Clerk
    const { userId } = await auth(); 
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Request Body
    const body = await req.json();
    const { amount, phoneNumber, planName } = body;

    // 3. Prepare M-Pesa Credentials
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 4. Initiate STK Push (Defining mpesaResponse in the main scope)
    const mpesaResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)), // Ensure integer for Safaricom
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: planName.replace(/\s/g, ""), // M-Pesa refs cannot have spaces
        TransactionDesc: `DAPC ${planName} Payment`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 5. Save Transaction to Database via Prisma
    // This creates a record with 'PENDING' status for the callback to update later
    await prisma.transaction.create({
      data: {
        userId: userId,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        plan: planName,
        checkoutRequestId: mpesaResponse.data.CheckoutRequestID,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "STK Push Sent. Please check your phone." 
    });

  } catch (error: any) {
    // Detailed logging for Vercel troubleshooting
    console.error("DETAILED_STK_ERROR:", error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.errorMessage || error.message || "Payment failed to initialize" 
      },
      { status: 500 }
    );
  }
}