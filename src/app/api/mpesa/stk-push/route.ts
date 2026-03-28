import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

/**
 * Helper: Generates the M-Pesa OAuth Access Token
 */
async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("Missing M-Pesa API Keys in Environment");
  }

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
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    let { amount, phoneNumber, planName } = body;

    // 2. Strict Data Sanitization (Fixes Safaricom 400/Rejection)
    // Format: 2547XXXXXXXX
    let cleanPhone = phoneNumber.replace(/\D/g, ""); 
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.slice(1);
    } else if (cleanPhone.length === 9) {
      cleanPhone = "254" + cleanPhone;
    }

    // Safaricom AccountRef: Alphanumeric only, No spaces, Max 12 chars
    const safeRef = planName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    // 3. Prepare M-Pesa Request
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    
    // Fallback to standard Sandbox values if Env is missing
    const shortCode = process.env.MPESA_SHORTCODE?.trim() || "174379";
    const passKey = process.env.MPESA_PASSKEY?.trim() || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");

    const mpesaResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)), 
        PartyA: cleanPhone,
        PartyB: shortCode,
        PhoneNumber: cleanPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: safeRef, 
        TransactionDesc: `DAPC ${safeRef}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 4. Save Pending Transaction to Prisma
    await prisma.transaction.create({
      data: {
        userId,
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
      message: "STK Push Sent. Please enter your PIN on your phone." 
    });

  } catch (error: any) {
    // Detailed error logging for Vercel troubleshooting
    const errorData = error.response?.data;
    console.error("STK_PUSH_CRITICAL_FAILURE:", errorData || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorData?.errorMessage || "Safaricom Rejected: Please verify credentials and phone format." 
      },
      { status: 500 }
    );
  }
}