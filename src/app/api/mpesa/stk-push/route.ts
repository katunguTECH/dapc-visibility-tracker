import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();
  
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
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { amount, phoneNumber, planName } = body;

    // 1. Sanitize Phone Number (Must be 254...)
    let cleanPhone = phoneNumber.replace(/\D/g, ""); 
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.slice(1);
    } else if (cleanPhone.length === 9) {
      cleanPhone = "254" + cleanPhone;
    }

    // 2. Prepare Safaricom Credentials
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    
    // Fallback to Sandbox Defaults if Env vars are missing
    const shortCode = process.env.MPESA_SHORTCODE?.trim() || "174379";
    const passKey = process.env.MPESA_PASSKEY?.trim() || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");

    // 3. Initiate STK Push
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
        AccountReference: planName.replace(/\s/g, "").substring(0, 12), 
        TransactionDesc: `DAPC ${planName}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const checkoutRequestId = mpesaResponse.data.CheckoutRequestID;

    // 4. Save to Prisma Database
    // This creates the record that your "Status Check" API will monitor
    await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        phoneNumber: cleanPhone,
        plan: planName,
        checkoutRequestId: checkoutRequestId,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    // 5. Return Success + ID to the Frontend Modal
    return NextResponse.json({ 
      success: true, 
      message: "STK Push Sent!", 
      checkoutRequestId: checkoutRequestId 
    });

  } catch (error: any) {
    console.error("STK_PUSH_CRITICAL_FAILURE:", error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.errorMessage || "Safaricom Rejected: Check Phone Format";
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}