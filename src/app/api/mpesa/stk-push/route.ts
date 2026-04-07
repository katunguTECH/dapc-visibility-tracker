// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone number or amount missing" },
        { status: 400 }
      );
    }

    // 2️⃣ Load environment variables
    const {
      MPESA_CONSUMER_KEY: key,
      MPESA_CONSUMER_SECRET: secret,
      MPESA_SHORTCODE: shortcode,
      MPESA_PASSKEY: passkey,
      MPESA_CALLBACK_URL: callback,
    } = process.env;

    if (!key || !secret || !shortcode || !passkey || !callback) {
      console.error("Missing M-Pesa environment variables", {
        key,
        secret,
        shortcode,
        passkey,
        callback,
      });
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("Received STK request:", { phone, amount });

    // 3️⃣ Format phone number (0712345678 → 254712345678)
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    // 4️⃣ Generate OAuth token
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const tokenData = await tokenRes.json();
    console.log("OAuth response:", tokenData);

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Failed to get access token" },
        { status: 500 }
      );
    }

    // 5️⃣ Prepare STK Push request
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64"
    );

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(amount)),
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callback,
          AccountReference: "DAPC",
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    const stkData = await stkRes.json();
    console.log("STK Push Response:", stkData);

    if (stkData.ResponseCode && stkData.ResponseCode !== "0") {
      return NextResponse.json(
        { success: false, message: stkData.ResponseDescription || "STK failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: stkData });
  } catch (err: any) {
    console.error("Internal STK error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}