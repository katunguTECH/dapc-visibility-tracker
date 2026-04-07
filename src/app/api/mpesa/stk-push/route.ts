import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and amount required" },
        { status: 400 }
      );
    }

    const env = process.env;

    if (
      !env.MPESA_CONSUMER_KEY ||
      !env.MPESA_CONSUMER_SECRET ||
      !env.MPESA_SHORTCODE ||
      !env.MPESA_PASSKEY ||
      !env.MPESA_CALLBACK_URL
    ) {
      console.error("ENV ERROR:", env);
      return NextResponse.json(
        { success: false, message: "Missing env variables" },
        { status: 500 }
      );
    }

    const phoneFormatted = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    // 🔐 AUTH
    const auth = Buffer.from(
      `${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    const tokenText = await tokenRes.text();

    if (!tokenRes.ok) {
      console.error("TOKEN ERROR:", tokenText);
      return NextResponse.json(
        { success: false, message: tokenText },
        { status: 500 }
      );
    }

    const token = JSON.parse(tokenText)?.access_token;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No access token" },
        { status: 500 }
      );
    }

    // 📦 STK
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Number(amount),
          PartyA: phoneFormatted,
          PartyB: env.MPESA_SHORTCODE,
          PhoneNumber: phoneFormatted,
          CallBackURL: env.MPESA_CALLBACK_URL,
          AccountReference: "DAPC",
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    const stkText = await stkRes.text();

    if (!stkRes.ok) {
      console.error("STK ERROR:", stkText);
      return NextResponse.json(
        { success: false, message: stkText },
        { status: 500 }
      );
    }

    const data = JSON.parse(stkText);

    return NextResponse.json({ success: true, data });

  } catch (err: any) {
    console.error("FATAL:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}