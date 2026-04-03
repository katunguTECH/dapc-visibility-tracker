import { NextResponse } from "next/server";

const consumerKey = process.env.MPESA_CONSUMER_KEY!;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
const shortCode = process.env.MPESA_SHORTCODE!;
const passkey = process.env.MPESA_PASSKEY!;

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount } = await req.json();

    if (!phoneNumber.startsWith("254")) {
      return NextResponse.json(
        { message: "Invalid Safaricom number" },
        { status: 400 }
      );
    }

    // 1. Get Access Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );

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

    // 2. Generate Password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );

    // 3. STK Push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortCode,
          PhoneNumber: phoneNumber,
          CallBackURL: "https://yourdomain.com/api/mpesa/callback",
          AccountReference: "DAPC",
          TransactionDesc: "Subscription Payment",
        }),
      }
    );

    const stkData = await stkRes.json();

    return NextResponse.json(stkData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "STK Push Failed" },
      { status: 500 }
    );
  }
}