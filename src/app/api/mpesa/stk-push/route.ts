import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; 
// Ensure this import uses curly braces { prisma }
import { prisma } from "@/lib/prisma"; 
import axios from "axios";

// ... (keep your getMpesaToken function the same)

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    // Debugging: This will show up in your Vercel logs to confirm it's working
    console.log("Checking Prisma initialization:", !!prisma);
    
    if (!prisma || !prisma.transaction) {
      throw new Error("Prisma Transaction model is not available. Did you run npx prisma db push?");
    }

    const body = await req.json();
    const { amount, phoneNumber, planName } = body;

    // ... (Your M-Pesa STK Push logic here)

    // 2. Save to DB
    await prisma.transaction.create({
      data: {
        userId,
        amount: parseFloat(amount),
        phoneNumber,
        plan: planName,
        checkoutRequestId: mpesaResponse.data.CheckoutRequestID,
        merchantRequestId: mpesaResponse.data.MerchantRequestID,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, message: "STK Push Sent" });

  } catch (error: any) {
    console.error("DETAILED_STK_ERROR:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}