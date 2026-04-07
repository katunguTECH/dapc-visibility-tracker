import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    const {
      MPESA_CONSUMER_KEY: key,
      MPESA_CONSUMER_SECRET: secret,
      MPESA_SHORTCODE: shortcode,
      MPESA_PASSKEY: passkey,
      MPESA_CALLBACK_URL: callback,
    } = process.env;

    if (!key || !secret || !shortcode || !passkey || !callback) {
      console.error("Missing M-Pesa Environment Variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Format phone
    const formattedPhone = phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    // Get OAuth token
    const auth = Buffer.from(`${key}:${secret}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error("Auth failed:", tokenData);
      return NextResponse.json(
        { success: false, message: "Failed to get access token" },
        { status: 500 }
      );
    }

    const accessToken = tokenData.access_token;

    // Generate timestamp YYYYMMDDHHMMSS
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp =
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());

    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    // Send STK Push
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
    console.log("STK Push response:", stkData);

    if (stkData.ResponseCode !== "0") {
      return NextResponse.json(
        { success: false, message: stkData.ResponseDescription || "STK Push failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: stkData });
  } catch (error: any) {
    console.error("Internal Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}