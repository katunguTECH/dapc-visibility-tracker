// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and amount are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Load environment variables
    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_SHORTCODE,
      MPESA_PASSKEY,
      MPESA_CALLBACK_URL,
    } = process.env;

    if (
      !MPESA_CONSUMER_KEY ||
      !MPESA_CONSUMER_SECRET ||
      !MPESA_SHORTCODE ||
      !MPESA_PASSKEY ||
      !MPESA_CALLBACK_URL
    ) {
      console.error("Missing M-Pesa environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // 3️⃣ Format phone number (e.g., 0712345678 → 254712345678)
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    // 4️⃣ Generate OAuth token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const tokenText = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("OAuth token request failed:", tokenText);
      return NextResponse.json(
        { success: false, message: "Failed to get access token", data: tokenText },
        { status: 500 }
      );
    }

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch {
      console.error("Token response not JSON:", tokenText);
      return NextResponse.json(
        { success: false, message: "Invalid token response" },
        { status: 500 }
      );
    }

    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      console.error("Access token missing", tokenData);
      return NextResponse.json(
        { success: false, message: "Access token missing" },
        { status: 500 }
      );
    }

    // 5️⃣ Prepare STK Push payload
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

    // 6️⃣ Call STK Push API
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkText = await stkRes.text();
    if (!stkRes.ok) {
      console.error("STK Push failed:", stkText);
      return NextResponse.json(
        { success: false, message: "STK Push failed", data: stkText },
        { status: 500 }
      );
    }

    let stkData;
    try {
      stkData = JSON.parse(stkText);
    } catch {
      console.error("STK Push response not JSON:", stkText);
      return NextResponse.json(
        { success: false, message: "Invalid STK Push response", data: stkText },
        { status: 500 }
      );
    }

    console.log("M-Pesa STK Push response:", stkData);

    return NextResponse.json({ success: true, data: stkData });
  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}