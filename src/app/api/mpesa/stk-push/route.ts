import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let { phoneNumber, amount, planName } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: "Missing phone or amount" }, { status: 400 });
    }

    phoneNumber = phoneNumber.replace(/\D/g, "");
    if (phoneNumber.startsWith("0")) phoneNumber = "254" + phoneNumber.slice(1);
    else if (phoneNumber.startsWith("7")) phoneNumber = "254" + phoneNumber;

    const tokenRes = await fetch(
      MPESA_ENV === "sandbox"
        ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(MPESA_CONSUMER_KEY + ":" + MPESA_CONSUMER_SECRET).toString("base64"),
        },
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const stkPushRes = await fetch(
      MPESA_ENV === "sandbox"
        ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: Buffer.from(MPESA_SHORTCODE + MPESA_PASSKEY + new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "")).toString("base64"),
          Timestamp: new Date().toISOString().slice(0, 19).replace(/[-:T]/g, ""),
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: "https://dapc.co.ke/api/mpesa/callback", // your public callback
          AccountReference: planName,
          TransactionDesc: `Subscription payment for ${planName}`,
        }),
      }
    );

    const stkData = await stkPushRes.json();
    console.log("STK Push response:", stkData);

    return NextResponse.json(stkData);
  } catch (error) {
    console.error("STK Push error:", error);
    return NextResponse.json({ error: "Payment failed. Try again." }, { status: 500 });
  }
}