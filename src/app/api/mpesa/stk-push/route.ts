import { NextResponse } from "next/server";
import axios from "axios";

async function getMpesaToken() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` },
  });
  return res.data.access_token;
}

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber, planName } = await req.json();

    // 1. SANITIZE NUMBER
    let cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) cleanNumber = "254" + cleanNumber.slice(1);
    if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) cleanNumber = "254" + cleanNumber;

    if (cleanNumber.length !== 12) {
      return NextResponse.json({ message: "Invalid Safaricom number" }, { status: 400 });
    }

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkData = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", 
      Amount: Math.round(amount),
      PartyA: cleanNumber, 
      PhoneNumber: cleanNumber, 
      PartyB: process.env.MPESA_SHORTCODE,
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: planName.replace(/\s/g, "").substring(0, 12),
      TransactionDesc: "DAPC Audit",
    };

    const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", stkData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data?.errorMessage || "STK Push failed" }, { status: 500 });
  }
}