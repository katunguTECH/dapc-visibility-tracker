// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json({ success: false, message: "Phone and amount are required" }, { status: 400 });
    }

    // Load environment variables
    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_SHORTCODE,
      MPESA_PASSKEY,
      MPESA_CALLBACK_URL,
    } = process.env;

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
      console.error("Missing M-Pesa environment variables");
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // Format phone number to international format
    const formattedPhone = phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    // 1️⃣ Get OAuth token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("OAuth token request failed:", text);
      return NextResponse.json({ success: false, message: "Failed to get access token", data: text }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      console.error("Access token missing", tokenData);
      return NextResponse.json({ success: false, message: "Access token missing", data: tokenData }, { status: 500 });
    }

    // 2️⃣ Prepare STK Push payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkPayload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(Number(amount)),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: "DAPC",
      TransactionDesc: "DAPC Payment",
    };

    // 3️⃣ Send STK Push request
    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const text = await stkRes.text();

    if (!stkRes.ok) {
      console.error("STK Push failed:", text);
      return NextResponse.json({ success: false, message: "STK Push failed", data: text }, { status: 500 });
    }

    // Attempt to parse JSON
    let stkData;
    try {
      stkData = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse STK Push response:", text);
      return NextResponse.json({ success: false, message: "Invalid STK response", data: text }, { status: 500 });
    }

    console.log("M-Pesa Response:", stkData);
    return NextResponse.json({ success: true, data: stkData });

  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Unknown error" }, { status: 500 });
  }
}