import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and amount required" },
        { status: 400 }
      );
    }

    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_SHORTCODE,
      MPESA_PASSKEY,
      MPESA_CALLBACK_URL,
    } = process.env;

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      return NextResponse.json(
        { success: false, message: "Missing env vars" },
        { status: 500 }
      );
    }

    // Format phone (0712 → 254712)
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    // OAuth
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenText = await tokenRes.text();

    let accessToken;
    try {
      accessToken = JSON.parse(tokenText).access_token;
    } catch {
      console.error("Token parse error:", tokenText);
      return NextResponse.json(
        { success: false, message: "Invalid token response" },
        { status: 500 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No access token" },
        { status: 500 }
      );
    }

    // Timestamp + password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // STK Push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Number(amount),
          PartyA: formattedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: MPESA_CALLBACK_URL,
          AccountReference: "DAPC",
          TransactionDesc: "Payment",
        }),
      }
    );

    const stkText = await stkRes.text();

    try {
      const data = JSON.parse(stkText);
      return NextResponse.json({ success: true, data });
    } catch {
      console.error("STK parse error:", stkText);
      return NextResponse.json(
        { success: false, message: "Invalid STK response" },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}