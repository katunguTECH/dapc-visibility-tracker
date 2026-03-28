import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

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
    const { userId } = await auth(); 
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    let { amount, phoneNumber, planName } = body;

    // 1. STRICT PHONE SANITIZATION
    // Safaricom Sandbox ONLY accepts 2547XXXXXXXX or 2541XXXXXXXX
    let cleanPhone = phoneNumber.replace(/\D/g, ""); // Remove everything except numbers
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith("7") || cleanPhone.startsWith("1")) {
      cleanPhone = "254" + cleanPhone;
    }

    // 2. ACCOUNT REFERENCE (Max 12 chars, no spaces)
    const safeRef = planName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    
    // Ensure these ENV vars are strings and trimmed
    const shortCode = process.env.MPESA_SHORTCODE?.trim();
    const passKey = process.env.MPESA_PASSKEY?.trim();
    
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
        TransactionDesc: `DAPC${safeRef}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

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

    return NextResponse.json({ success: true, message: "STK Push Sent!" });

  } catch (error: any) {
    console.error("SAFARICOM_REJECTION_LOG:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.errorMessage || "Safaricom Rejection: Check Credentials" },
      { status: 500 }
    );
  }
}