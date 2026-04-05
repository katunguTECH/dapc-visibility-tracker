import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, planName, userId } = await req.json();

    if (!phoneNumber || !amount || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔥 STEP 1: Create transaction FIRST (no IDs yet)
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber,
        plan: planName,
        checkoutRequestId: "", // will update after STK
        merchantRequestId: "",
        status: "PENDING",
      },
    });

    // 🔑 Unique reference (for logs/debugging)
    const accountReference = `DAPC-${userId}-${Date.now()}`;

    // 🔐 STEP 2: Get Safaricom Access Token
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

    // ⏱️ STEP 3: Generate timestamp + password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // 📡 STEP 4: Send STK Push
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
          PartyA: phoneNumber,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,

          // 🔥 IMPORTANT FIX
          AccountReference: accountReference,
          TransactionDesc: `Payment for ${planName}`,
        }),
      }
    );

    const data = await stkResponse.json();

    // ❌ If STK failed → update transaction
    if (data.ResponseCode !== "0") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "FAILED",
          resultDesc: data.errorMessage || "STK failed",
        },
      });

      return NextResponse.json(
        { message: "STK Push failed", error: data },
        { status: 500 }
      );
    }

    // ✅ STEP 5: Save request IDs (CRITICAL FOR CALLBACK)
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
      },
    });

    return NextResponse.json({
      message: "STK Push sent successfully",
      checkoutRequestId: data.CheckoutRequestID,
    });

  } catch (error) {
    console.error("STK Push Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}