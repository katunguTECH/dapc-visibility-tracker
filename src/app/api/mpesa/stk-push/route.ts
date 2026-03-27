import { NextResponse } from "next/server";
import { getAccessToken, getMpesaPassword } from "@/lib/mpesa";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { amount, phoneNumber } = await req.json();
    
    // 1. Prepare Safaricom Credentials
    const token = await getAccessToken();
    const { password, timestamp } = getMpesaPassword();

    // 2. Format Phone Number (Ensuring it starts with 254)
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `254${phoneNumber.slice(1)}` 
      : phoneNumber;

    // 3. Request STK Push from Safaricom
    const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
        AccountReference: "DAPC_Visibility",
        TransactionDesc: "Payment for DAPC Market Intelligence",
      }),
    });

    const data = await stkResponse.json();

    // 4. If Safaricom accepts the request, save the PENDING transaction
    if (data.ResponseCode === "0") {
      await prisma.transaction.create({
        data: {
          userId: userId,
          amount: parseFloat(amount),
          phoneNumber: formattedPhone,
          checkoutRequestId: data.CheckoutRequestID,
          merchantRequestId: data.MerchantRequestID,
          status: "PENDING",
        },
      });

      return NextResponse.json({ success: true, message: "STK Push initiated" });
    } else {
      return NextResponse.json({ success: false, message: data.ResponseDescription }, { status: 400 });
    }

  } catch (error) {
    console.error("STK Push Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}