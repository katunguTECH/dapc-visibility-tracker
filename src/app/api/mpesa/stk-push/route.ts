// src/app/api/mpesa/stk-push/route.ts
import { NextResponse } from "next/server";

// Interface for transaction
interface Transaction {
  id: string;
  phone: string;
  amount: number;
  planName: string;
  transactionDate: string;
  status: 'completed' | 'pending' | 'failed';
  mpesaReceipt?: string;
  customerName?: string;
  customerEmail?: string;
}

// Helper function to save transaction to localStorage (server-side we'll use a different approach)
// For now, we'll return the transaction data and let the client save it
function createTransactionObject(phone: string, amount: number, planName: string, status: 'completed' | 'pending' | 'failed', mpesaReceipt?: string): Transaction {
  return {
    id: Date.now().toString(),
    phone: phone,
    amount: amount,
    planName: planName,
    transactionDate: new Date().toISOString(),
    status: status,
    mpesaReceipt: mpesaReceipt,
  };
}

export async function POST(req: Request) {
  try {
    const { phone, amount, planName, customerName, customerEmail } = await req.json();

    const {
      MPESA_CONSUMER_KEY,
      MPESA_CONSUMER_SECRET,
      MPESA_SHORTCODE,
      MPESA_PASSKEY,
      MPESA_CALLBACK_URL,
    } = process.env;

    // Validate environment variables
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
      console.error("Missing M-Pesa environment variables");
      return NextResponse.json(
        { success: false, message: "M-Pesa configuration error" },
        { status: 500 }
      );
    }

    // Format phone number
    let formattedPhone = phone;
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.substring(1);
    }

    // Validate phone number format
    if (!formattedPhone.match(/^254[17]\d{8}$/)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Get access token
    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: { Authorization: `Basic ${auth}` },
      }
    );

    if (!tokenRes.ok) {
      console.error("Failed to get M-Pesa token");
      return NextResponse.json(
        { success: false, message: "Failed to authenticate with M-Pesa" },
        { status: 500 }
      );
    }

    const { access_token } = await tokenRes.json();

    // Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    // Prepare STK push request
    const stkPushRequest = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL || "https://your-domain.com/api/mpesa/callback",
      AccountReference: "DAPC",
      TransactionDesc: `DAPC ${planName} Subscription`,
    };

    console.log("Sending STK push request:", { ...stkPushRequest, Password: "***" });

    // Send STK push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushRequest),
      }
    );

    const data = await stkRes.json();
    console.log("STK Push Response:", data);

    // Check if STK push was successful
    if (data.ResponseCode === "0") {
      // Create a pending transaction record
      const transaction = createTransactionObject(
        formattedPhone,
        amount,
        planName,
        'pending',
        data.CheckoutRequestID
      );

      // In a production environment, you would save this to a database
      // For now, we'll return the transaction data to be saved on the client
      
      return NextResponse.json({ 
        success: true, 
        data,
        transaction,
        message: "STK push sent successfully. Check your phone for the M-Pesa prompt."
      });
    } else {
      // Create a failed transaction record
      const transaction = createTransactionObject(
        formattedPhone,
        amount,
        planName,
        'failed'
      );

      console.error("STK Push failed:", data);
      return NextResponse.json(
        { 
          success: false, 
          message: data.ResponseDescription || "STK push failed. Please try again.",
          transaction 
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("M-Pesa API Error:", err);
    
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || "An error occurred while processing your payment. Please try again."
      },
      { status: 500 }
    );
  }
}

// Optional: Callback endpoint for M-Pesa to confirm payment status
export async function PUT(req: Request) {
  try {
    const callbackData = await req.json();
    console.log("M-Pesa Callback received:", JSON.stringify(callbackData, null, 2));

    // Extract transaction details from callback
    const stkCallback = callbackData.Body?.stkCallback;
    
    if (stkCallback) {
      const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;
      
      const status = ResultCode === 0 ? 'completed' : 'failed';
      const mpesaReceipt = CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      const amount = CallbackMetadata?.Item?.find((item: any) => item.Name === 'Amount')?.Value;
      const phone = CallbackMetadata?.Item?.find((item: any) => item.Name === 'PhoneNumber')?.Value;
      
      console.log(`Transaction ${CheckoutRequestID}: ${ResultDesc} (${ResultCode})`);
      console.log(`Receipt: ${mpesaReceipt}, Amount: ${amount}, Phone: ${phone}`);
      
      // Here you would update the transaction status in your database
      // For now, we'll just log it
      
      return NextResponse.json({ success: true, message: "Callback processed" });
    }
    
    return NextResponse.json({ success: true, message: "No callback data" });
  } catch (err: any) {
    console.error("Callback Error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}