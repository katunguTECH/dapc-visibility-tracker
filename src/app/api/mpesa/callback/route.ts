// src/app/api/mpesa/callback/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("M-Pesa Callback received:", body);
    
    // Return success response to M-Pesa
    return NextResponse.json({ 
      ResultCode: 0, 
      ResultDesc: "Success" 
    });
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Failed" },
      { status: 200 } // M-Pesa expects 200 even on failure
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "M-Pesa callback endpoint is ready" });
}