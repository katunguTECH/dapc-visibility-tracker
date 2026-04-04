import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure your prisma client path is correct

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, planName, userId } = await req.json();

    if (!phoneNumber || !amount || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 1. Get Safaricom Access Token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    const { access_token } = await tokenRes.json();

    // 2. Prepare STK Push Parameters
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: phoneNumber, // Format: 2547XXXXXXXX
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
          AccountReference: "DAPC_VISIBILITY",
          TransactionDesc: `Payment for ${planName}`,
        }),
      }
    );

    const data = await stkResponse.json();

    if (data.ResponseCode === "0") {
      // 3. Save to Prisma Transaction Model
      await prisma.transaction.create({
        data: {
          userId: userId,
          amount: parseFloat(amount),
          phoneNumber: phoneNumber,
          plan: planName,
          checkoutRequestId: data.CheckoutRequestID,
          merchantRequestId: data.MerchantRequestID,
          status: "PENDING",
        },
      });

      return NextResponse.json({ 
        message: "STK Push sent successfully", 
        CheckoutRequestID: data.CheckoutRequestID 
      });
    } else {
      return NextResponse.json({ message: "STK Push failed", error: data }, { status: 500 });
    }
  } catch (error) {
    console.error("STK Push Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}