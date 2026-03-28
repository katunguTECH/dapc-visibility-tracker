import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { amount, phoneNumber } = await req.json();

    // 1. FORMAT PHONE NUMBER (Ensure it starts with 254)
    const formattedPhone = phoneNumber.startsWith("0") 
      ? `254${phoneNumber.slice(1)}` 
      : phoneNumber.startsWith("+") 
      ? phoneNumber.slice(1) 
      : phoneNumber;

    // 2. GENERATE ACCESS TOKEN
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 3. PREPARE STK PUSH PARAMETERS
    const shortcode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    
    const password = Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");

    // SANITIZE CALLBACK URL: Strips trailing slashes to prevent "Bad Request"
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const callbackUrl = `${baseUrl}/api/mpesa/callback`;

    // 4. INITIATE STK PUSH
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl, // This is the strict part
        AccountReference: "DAPC_VISIBILITY",
        TransactionDesc: "Payment for DAPC Pro Audit",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json({ 
      success: true, 
      data: stkResponse.data 
    });

  } catch (error: any) {
    // Log the full error for Vercel Runtime Logs
    console.error("M-Pesa API Error Details:", error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.errorMessage || error.message || "Safaricom API Connection Failed";
    
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}