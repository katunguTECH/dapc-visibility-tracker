import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

// FIXED: Updated apiVersion to match the SDK's expected type
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: "2023-10-16" 
});

export async function POST(req: NextRequest) {
  try {
    // FIXED: Modern Clerk auth syntax
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ... rest of your Stripe session logic here ...

  } catch (error) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}