import { NextResponse } from "next/server";
import axios from "axios";

// 1. Generate OAuth Token from Safaricom
async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  // Basic Auth header
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("TOKEN ERROR:", error.response?.data || error.message);
    throw new Error("M-Pesa token generation failed");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, phoneNumber, planName } = body;

    // --- 2. PHONE NUMBER SANITIZATION (The Fix) ---
    // Remove non-digits (spaces, +, dashes)
    let cleanNumber = phoneNumber.replace(/\D/g, "");

    // Convert 07... or 01... to 254...
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "254" + cleanNumber.slice(1);
    }
    // Convert 7... or 1... to 254...
    else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
      cleanNumber = "254" + cleanNumber;
    }

    // Validation: Must be 12 digits starting with 254
    if (cleanNumber.length !== 12 || !cleanNumber.startsWith("254")) {
      return NextResponse.json(
        { success: false, message: "Invalid Safaricom number. Use 07... or 254..." },
        { status: 400 }
      );
    }

    // --- 3. PREPARE STK PUSH DATA ---
    const token = await getMpesaToken();
    const shortCode = process.env.MPESA_SHORTCODE || "174379"; 
    const passkey = process.env.MPESA_PASSKEY;
    
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    // Clean account reference (Safaricom allows max 12 alphanumeric chars)
    const sanitizedAccount = (planName || "DAPC").replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    const stkData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", 
      Amount: Math.round(amount),
      PartyA: cleanNumber, 
      PhoneNumber: cleanNumber, 
      PartyB: shortCode,
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: sanitizedAccount,
      TransactionDesc: `DAPC ${sanitizedAccount}`,
    };

    // --- 4. SEND REQUEST TO SAFARICOM ---
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "STK Push initiated successfully",
      data: response.data 
    });

  } catch (error: any) {
    // Log the specific Safaricom error to your Vercel console
    console.error("SAFARICOM ERROR:", error.response?.data || error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.errorMessage || "STK Push failed. Check your balance or try again later." 
      }, 
      { status: 500 }
    );
  }
}