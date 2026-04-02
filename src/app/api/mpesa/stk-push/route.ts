import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, planName } = await req.json();

    // 1. Get Token (Ensure your getMpesaToken function is working)
    const token = await getMpesaToken(); 

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");

    const stkData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber, // Customer number
      PartyB: process.env.MPESA_SHORTCODE, // Your Paybill/Shortcode
      PhoneNumber: phoneNumber, // Customer number
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: planName.replace(/\s+/g, ""), // IMPORTANT: REMOVE SPACES
      TransactionDesc: `Pay_${planName.replace(/\s+/g, "_")}` // IMPORTANT: REMOVE SPACES
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", // Note: Ensure URL is /processrequest
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("STK PUSH ERROR:", error.response?.data || error.message);
    // Return the actual error from Safaricom for better debugging
    const errorMessage = error.response?.data?.errorMessage || "Prompt failed";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}