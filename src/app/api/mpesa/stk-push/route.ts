// src/app/api/mpesa/stk-push/route.ts
import { NextRequest, NextResponse } from "next/server";

// Use the built-in fetch instead of node-fetch
export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, planName } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { error: "Phone number and amount are required" },
        { status: 400 }
      );
    }

    // Normalize phone number
    let normalizedPhone = phoneNumber.replace(/\D/g, ""); // remove all non-digits
    if (normalizedPhone.startsWith("0")) normalizedPhone = "254" + normalizedPhone.slice(1);
    else if (normalizedPhone.startsWith("7")) normalizedPhone = "254" + normalizedPhone;

    // Fetch MPESA token
    const tokenRes = await fetch(
      `${process.env.MPESA_ENV === "live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
            ).toString("base64"),
        },
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("Failed to get MPESA access token");

    // STK Push request body
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const stkRes = await fetch(
      `${process.env.MPESA_ENV === "live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke"}/mpesa/stkpush/v1/processrequest`,
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
          Amount: amount,
          PartyA: normalizedPhone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: normalizedPhone,
          CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
          AccountReference: planName || "DAPC Subscription",
          TransactionDesc: planName || "DAPC Subscription",
        }),
      }
    );

    const stkData = await stkRes.json();
    return NextResponse.json(stkData);
  } catch (error) {
    console.error("STK Push Error:", error);
    return NextResponse.json(
      { error: "Payment failed. Try again." },
      { status: 500 }
    );
  }
}