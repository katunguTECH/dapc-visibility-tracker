// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, planName, userId } = await req.json();

    if (!phoneNumber || !amount || !planName || !userId) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Safaricom M-Pesa API credentials from env
    const mpesaUrl = process.env.MPESA_STK_PUSH_URL!;
    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const callbackUrl = process.env.MPESA_CALLBACK_URL!;

    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

    // Generate password (base64 of shortcode+passkey+timestamp)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Prepare STK Push request body
    const stkBody = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: planName,
      TransactionDesc: `Payment for ${planName}`,
    };

    // Get OAuth token
    const tokenResponse = await axios.get(`${process.env.MPESA_TOKEN_URL}`, {
      auth: { username: consumerKey, password: consumerSecret },
    });
    const token = tokenResponse.data.access_token;

    // Send STK Push
    const response = await axios.post(mpesaUrl, stkBody, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("STK Push Response:", response.data);

    if (response.data.ResponseCode === "0") {
      return NextResponse.json({ message: "STK Push sent. Check your phone.", data: response.data });
    } else {
      return NextResponse.json({
        message: `STK Push failed: ${response.data.ResponseDescription}`,
        data: response.data,
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error("STK Push Error:", err.response?.data || err.message || err);
    return NextResponse.json({
      message: "Payment initiation failed.",
      error: err.response?.data || err.message,
    }, { status: 500 });
  }
}