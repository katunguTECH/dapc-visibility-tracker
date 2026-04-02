import { NextResponse } from "next/server";
import axios from "axios";

// Generate OAuth Token
async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("TOKEN ERROR:", error.response?.data || error.message);
    throw new Error("M-Pesa token generation failed");
  }
}

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, planName } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const token = await getMpesaToken();
    const shortCode = process.env.MPESA_SHORTCODE; 
    const passkey = process.env.MPESA_PASSKEY;
    
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    // Clean account reference for Safaricom (no spaces)
    const sanitizedAccount = planName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    const stkData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", 
      Amount: Math.round(amount),
      // THESE TWO FIELDS ARE WHAT DETERMINE WHO GETS THE PROMPT
      PartyA: phoneNumber, 
      PhoneNumber: phoneNumber, 
      PartyB: shortCode,
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: sanitizedAccount,
      TransactionDesc: `DAPC_${sanitizedAccount}`,
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    console.error("SAFARICOM ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      { success: false, message: error.response?.data?.errorMessage || "STK Push failed" }, 
      { status: 500 }
    );
  }
}