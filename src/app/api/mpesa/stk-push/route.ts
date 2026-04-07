import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    // 1. Log incoming request for debugging
    console.log("M-Pesa Triggered for:", phone, "Amount:", amount);

    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    // 2. Strict Env Check
    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      console.error("CRITICAL ERROR: Missing M-Pesa Environment Variables");
      return NextResponse.json({ success: false, message: "Server config missing" }, { status: 500 });
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // 3. Get Access Token
    // NOTE: Use sandbox.safaricom.co.ke if you are not live yet!
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { 
        headers: { Authorization: `Basic ${auth}` },
        cache: 'no-store' 
      }
    );

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("OAuth Fetch Failed:", errText);
      return NextResponse.json({ success: false, message: "Mpesa Auth Failed" }, { status: 500 });
    }

    const { access_token } = await tokenRes.json();

    // 4. Generate Credentials
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const formattedPhone = phone.startsWith("0") ? "254" + phone.substring(1) : phone;

    // 5. STK Push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
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
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: "DAPC",
          TransactionDesc: "Payment for DAPC",
        }),
      }
    );

    const stkData = await stkRes.json();
    console.log("Mpesa API Response:", stkData);

    return NextResponse.json({ success: true, data: stkData });

  } catch (error: any) {
    console.error("Global API Error:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}