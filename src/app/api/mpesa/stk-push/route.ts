import { NextResponse } from "next/server";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;

export async function POST(req: Request) {
  try {
    let { phoneNumber, amount, planName } = await req.json();

    phoneNumber = phoneNumber.replace(/\D/g, "");
    if (phoneNumber.startsWith("0")) phoneNumber = "254" + phoneNumber.slice(1);
    else if (phoneNumber.startsWith("7")) phoneNumber = "254" + phoneNumber;

    if (!/^2547\d{8}$/.test(phoneNumber)) {
      return NextResponse.json({ message: "Invalid Safaricom number" }, { status: 400 });
    }

    // Get access token
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: "Basic " + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64"),
        },
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Timestamp & password
    const timestamp = new Date().toISOString().replace(/[-T:Z.]/g, "").slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

    // STK Push request
    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
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
        PartyA: phoneNumber,
        PartyB: SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: CALLBACK_URL,
        AccountReference: planName,
        TransactionDesc: `Payment for ${planName}`,
      }),
    });

    const data = await stkRes.json();
    console.log("STK PUSH RESPONSE:", data);

    if (data.ResponseCode === "0") {
      return NextResponse.json({ message: "STK Push sent successfully" });
    } else {
      return NextResponse.json({ message: data.ResponseDescription || "STK Push failed" }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}