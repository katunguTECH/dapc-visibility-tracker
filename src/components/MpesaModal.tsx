// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

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
    const { phoneNumber, amount, planName, userId } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const callbackUrl = process.env.MPESA_CALLBACK_URL!;

    // 🔐 Get token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const tokenRes = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const token = tokenRes.data.access_token;

    // ⏱ Generate password
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // 🚀 STK push request
    const stkRes = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Number(amount),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: planName || "DAPC",
        TransactionDesc: "DAPC Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STK SUCCESS:", stkRes.data);

    return NextResponse.json({
      success: true,
      data: stkRes.data,
    });

  } catch (err: any) {
    console.error("STK ERROR:", err.response?.data || err.message);

    return NextResponse.json(
      {
        success: false,
        error: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}