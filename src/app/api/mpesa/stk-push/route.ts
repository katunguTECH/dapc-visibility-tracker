import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, planName } = await req.json();

    // 1. Get Access Token (Ensure your helper function is solid)
    const token = await getMpesaToken(); 

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      (process.env.MPESA_SHORTCODE || "") + 
      (process.env.MPESA_PASSKEY || "") + 
      timestamp
    ).toString("base64");

    const stkData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", // For Paybill
      Amount: Math.round(amount), // FORCE INTEGER
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      // CRITICAL: Safaricom rejects AccountReference if it has spaces or > 12 chars
      AccountReference: planName.replace(/\s+/g, "").substring(0, 12),
      TransactionDesc: `Pay_${planName.replace(/\s+/g, "_")}`.substring(0, 20)
    };

    // Note: If using SANDBOX, use: https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest
    // If using PRODUCTION, use: https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    // Log the FULL error to your Vercel console so you can see why Safaricom said no
    console.error("SAFARICOM ERROR DETAILS:", error.response?.data || error.message);
    
    const detailedMessage = error.response?.data?.errorMessage || "Prompt failed";
    return NextResponse.json({ success: false, message: detailedMessage }, { status: 400 });
  }
}