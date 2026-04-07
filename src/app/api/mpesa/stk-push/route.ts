import { NextResponse } from "next/server";

// Helper to generate Safaricom-compatible timestamp
function getTimestamp() {
  const date = new Date();
  return (
    date.getFullYear().toString() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)
  );
}

export async function POST(req: Request) {
  try {
    // 1. Parse request body safely
    const body = await req.json();
    const { phoneNumber, amount, planName } = body;

    if (!phoneNumber || !amount) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // 2. Load and validate Environment Variables
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      console.error("CRITICAL: Missing Mpesa Environment Variables");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    // 3. Generate OAuth Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    // Using native fetch to avoid Axios header/get issues in Vercel
    const tokenRes = await fetch(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) {
      throw new Error("Failed to generate M-Pesa access token");
    }

    // 4. Generate Password and Timestamp
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 5. Trigger STK Push
    const stkRes = await fetch(
      "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(amount)), // Ensure it's an integer
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: (planName || "DAPC").substring(0, 12), // Safaricom limit is 12 chars
          TransactionDesc: "DAPC Payment",
        }),
      }
    );

    const stkData = await stkRes.json();

    if (stkRes.ok) {
      return NextResponse.json({ success: true, response: stkData });
    } else {
      console.error("Safaricom API Error:", stkData);
      return NextResponse.json({ success: false, error: stkData }, { status: stkRes.status });
    }

  } catch (err: any) {
    console.error("STK PUSH RUNTIME ERROR:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}