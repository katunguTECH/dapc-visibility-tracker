import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("MPESA STK PUSH HIT");

    // ✅ CORRECT way to read body
    const body = await req.json();

    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing phone or amount" },
        { status: 400 }
      );
    }

    /* =========================
       FORMAT PHONE NUMBER
    ========================= */
    const formattedPhone = phone.startsWith("0")
      ? "254" + phone.substring(1)
      : phone;

    /* =========================
       GET ACCESS TOKEN
    ========================= */
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenData = await tokenRes.json();

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("TOKEN ERROR:", tokenData);
      return NextResponse.json(
        { success: false, message: "Failed to get access token" },
        { status: 500 }
      );
    }

    /* =========================
       GENERATE PASSWORD
    ========================= */
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    /* =========================
       STK PUSH REQUEST
    ========================= */
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Number(amount),
          PartyA: formattedPhone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: "DAPC",
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    const stkData = await stkRes.json();

    console.log("STK RESPONSE:", stkData);

    if (stkData.ResponseCode === "0") {
      return NextResponse.json({ success: true, data: stkData });
    } else {
      return NextResponse.json(
        { success: false, message: stkData.ResponseDescription },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("MPESA ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}