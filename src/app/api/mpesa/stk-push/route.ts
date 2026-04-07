import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server"; // ← Import Clerk server auth

export async function POST(req: Request) {
  try {
    const { userId } = getAuth(req); // ← Get the signed-in user ID
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "You must be signed in to subscribe" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { success: false, message: "Phone and amount are required" },
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

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY || !MPESA_CALLBACK_URL) {
      console.error("Missing M-Pesa environment variables");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const formattedPhone = phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    // Get OAuth token
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("OAuth token request failed:", text);
      return NextResponse.json({ success: false, message: "Failed to get access token" }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      console.error("Access token missing", tokenData);
      return NextResponse.json({ success: false, message: "Access token missing" }, { status: 500 });
    }

    // STK Push payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

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
          Amount: Math.round(Number(amount)),
          PartyA: formattedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: MPESA_CALLBACK_URL,
          AccountReference: "DAPC",
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    if (!stkRes.ok) {
      const text = await stkRes.text();
      console.error("STK Push failed:", text);
      return NextResponse.json({ success: false, message: "STK Push failed", data: text }, { status: 500 });
    }

    const stkData = await stkRes.json();

    // Return personalized message
    return NextResponse.json({
      success: true,
      message: `Hi! Your STK Push was sent successfully to ${formattedPhone}.`,
      data: stkData,
    });
  } catch (error: any) {
    console.error("Internal Error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Unknown error" }, { status: 500 });
  }
}