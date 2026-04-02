import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, phoneNumber, planName } = body;

    // 1. GENERATE ACCESS TOKEN (Assume you have this helper)
    const token = await getMpesaToken(); 

    // 2. PREPARE STK PUSH DATA
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
      PartyA: phoneNumber, // DYNAMIC: Customer's number from the modal
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber, // DYNAMIC: Customer's number from the modal
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: planName.replace(/\s/g, ""), // No spaces allowed here
      TransactionDesc: `Payment for ${planName}`
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query", // Use production URL for live
      stkData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    return NextResponse.json({ success: false, message: "Prompt failed" });
  }
}