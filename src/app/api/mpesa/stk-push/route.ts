// src/app/api/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";

const MPESA_ENV = process.env.MPESA_ENV || "sandbox";
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;

async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
  const url =
    MPESA_ENV === "live"
      ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
      : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) throw new Error("Failed to get access token");

  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, planName } = await req.json();

    if (!phoneNumber || !amount || !planName)
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    // Sanitize phone number
    let msisdn = phoneNumber.replace(/\D/g, "");
    if (msisdn.startsWith("0")) msisdn = "254" + msisdn.slice(1);
    else if (msisdn.startsWith("7")) msisdn = "254" + msisdn;

    const accessToken = await getAccessToken();

    // STK Push request payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    const stkRes = await fetch(
      MPESA_ENV === "live"
        ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: msisdn,
          PartyB: SHORTCODE,
          PhoneNumber: msisdn,
          CallBackURL: "https://dapc.co.ke/api/mpesa/stk-callback",
          AccountReference: planName,
          TransactionDesc: `Payment for ${planName}`,
        }),
      }
    );

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      return NextResponse.json({ message: `Payment failed: ${stkData.ResponseDescription}` }, { status: 500 });
    }

    return NextResponse.json({ message: "STK Push sent! Check your phone to complete payment." });
  } catch (err: any) {
    console.error("M-Pesa STK Push Error:", err);
    return NextResponse.json({ message: "Payment failed. Try again." }, { status: 500 });
  }
}