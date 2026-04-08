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
      console.error("Missing env variables");
      return NextResponse.json(
        { success: false, message: "Server config error" },
        { status: 500 }
      );
    }

    // Format phone
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.slice(1)
      : phone;

    // 🔑 Generate OAuth token
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenText = await tokenRes.text();

    if (!tokenRes.ok) {
      console.error("TOKEN ERROR:", tokenText);
      return NextResponse.json(
        { success: false, message: "Token failed", error: tokenText },
        { status: 500 }
      );
    }

    const tokenData = JSON.parse(tokenText);
    const accessToken = tokenData.access_token;

    // 🔐 Generate password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 🚀 STK PUSH
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
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    const stkText = await stkRes.text();

    if (!stkRes.ok) {
      console.error("STK ERROR:", stkText);
      return NextResponse.json(
        { success: false, message: "STK failed", error: stkText },
        { status: 500 }
      );
    }

    const stkData = JSON.parse(stkText);

    return NextResponse.json({
      success: true,
      data: stkData,
    });
  } catch (error: any) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal error",
      },
      { status: 500 }
    );
  }
}