import { NextResponse } from "next/server";
import axios from "axios";

// Helper to get M-Pesa Token
async function getMpesaToken() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, planName } = await req.json();
    const token = await getMpesaToken();

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      (process.env.MPESA_SHORTCODE || "") + 
      (process.env.MPESA_PASSKEY || "") + 
      timestamp
    ).toString("base64");

    // SANITIZE EVERYTHING
    const shortPlanName = planName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    const stkData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: shortPlanName, // Strictly alphanumeric, max 12 chars
      TransactionDesc: `Pay${shortPlanName}`
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    // This logs the SPECIFIC reason to your terminal/Vercel logs
    const errorDetail = error.response?.data || error.message;
    console.error("CRITICAL MPESA ERROR:", errorDetail);

    return NextResponse.json({ 
      success: false, 
      message: error.response?.data?.errorMessage || "Request Rejected by Safaricom" 
    }, { status: 400 });
  }
}