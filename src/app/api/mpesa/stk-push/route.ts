import { NextResponse } from "next/server";
import axios from "axios";

// 1. Helper function to get the OAuth Access Token
async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  try {
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("TOKEN GENERATION ERROR:", error.response?.data || error.message);
    throw new Error("Failed to generate M-Pesa token");
  }
}

export async function POST(req: Request) {
  try {
    // 2. Extract dynamic data from the frontend request
    const { amount, phoneNumber, planName } = await req.json();

    if (!phoneNumber || !amount) {
      return NextResponse.json({ success: false, message: "Missing phone or amount" }, { status: 400 });
    }

    const token = await getMpesaToken();
    const shortCode = process.env.MPESA_SHORTCODE; // e.g., 174379 for Sandbox
    const passkey = process.env.MPESA_PASSKEY;
    
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

    // 3. Sanitize the Account Reference (Safaricom rejects spaces/special chars)
    const sanitizedAccount = planName.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);

    const stkData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline", // Use "CustomerBuyGoodsOnline" for Till
      Amount: Math.round(amount),
      // CRITICAL: PartyA and PhoneNumber MUST be the customer's number passed from the Modal
      PartyA: phoneNumber, 
      PartyB: shortCode,
      PhoneNumber: phoneNumber, 
      CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
      AccountReference: sanitizedAccount,
      TransactionDesc: `Pay_${sanitizedAccount}`,
    };

    // 4. Send request to Safaricom
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });

  } catch (error: any) {
    const errorDetail = error.response?.data || error.message;
    console.error("SAFARICOM API REJECTION:", errorDetail);

    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.errorMessage || "Payment request failed" 
      }, 
      { status: 400 }
    );
  }
}