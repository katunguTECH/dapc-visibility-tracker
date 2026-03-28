import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

async function getMpesaToken() {
  const authHeader = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${authHeader}` }
  });
  return response.data.access_token;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 
    if (!userId) return NextResponse.json({ success: false }, { status: 401 });

    const { amount, phoneNumber, planName } = await req.json();

    // Sanitize Phone
    let cleanPhone = phoneNumber.replace(/\D/g, ""); 
    if (cleanPhone.startsWith("0")) cleanPhone = "254" + cleanPhone.slice(1);

    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const mpesaResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(amount)), 
        PartyA: cleanPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: cleanPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa/callback`,
        AccountReference: planName.replace(/\s/g, "").substring(0, 12), 
        TransactionDesc: `DAPC ${planName}`,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const checkoutId = mpesaResponse.data.CheckoutRequestID;

    // Save PENDING transaction to Prisma Postgres
    await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        phoneNumber: cleanPhone,
        plan: planName,
        checkoutRequestId: checkoutId,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, checkoutRequestId: checkoutId });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}