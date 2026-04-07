import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    // 1. Validate Environment Variables
    const {
      MPESA_CONSUMER_KEY: key,
      MPESA_CONSUMER_SECRET: secret,
      MPESA_SHORTCODE: shortcode,
      MPESA_PASSKEY: passkey,
      MPESA_CALLBACK_URL: callback
    } = process.env;

    if (!key || !secret || !shortcode || !passkey) {
      console.error("Missing M-Pesa Environment Variables");
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // 2. Format Phone (e.g., 0712... to 254712...)
    const formattedPhone = phone.startsWith("0") ? "254" + phone.substring(1) : phone;

    // 3. Get OAuth Access Token
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Auth failed" }, { status: 500 });
    }

    // 4. Prepare STK Push Credentials
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 5. Send STK Push Request
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
    console.log("M-Pesa Response:", stkData);

    return NextResponse.json({ success: true, data: stkData });

  } catch (error: any) {
    console.error("Internal Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}