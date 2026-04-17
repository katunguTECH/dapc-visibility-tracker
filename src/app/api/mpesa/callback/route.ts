// src/app/api/mpesa/callback/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const callbackData = await req.json();
    console.log("=".repeat(50));
    console.log("M-Pesa Callback Received:");
    console.log("=".repeat(50));
    console.log(JSON.stringify(callbackData, null, 2));
    console.log("=".repeat(50));

    const stkCallback = callbackData.Body?.stkCallback;
    
    if (stkCallback) {
      const { 
        ResultCode, 
        ResultDesc, 
        CheckoutRequestID, 
        CallbackMetadata 
      } = stkCallback;
      
      const status = ResultCode === 0 ? 'completed' : 'failed';
      const mpesaReceipt = CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      const amount = CallbackMetadata?.Item?.find((item: any) => item.Name === 'Amount')?.Value;
      const phone = CallbackMetadata?.Item?.find((item: any) => item.Name === 'PhoneNumber')?.Value;
      const transactionDate = CallbackMetadata?.Item?.find((item: any) => item.Name === 'TransactionDate')?.Value;
      
      console.log(`\nTransaction Status: ${status}`);
      console.log(`CheckoutRequestID: ${CheckoutRequestID}`);
      console.log(`Result: ${ResultDesc} (Code: ${ResultCode})`);
      
      if (status === 'completed') {
        console.log(`\n✅ Payment Successful!`);
        console.log(`Receipt Number: ${mpesaReceipt}`);
        console.log(`Amount: KES ${amount}`);
        console.log(`Phone: ${phone}`);
        console.log(`Transaction Date: ${transactionDate}`);
        
        // Here you would update your database:
        // 1. Update transaction status to 'completed'
        // 2. Activate the user's subscription
        // 3. Save the M-Pesa receipt number
        // 4. Send confirmation email/SMS to customer
        
      } else {
        console.log(`\n❌ Payment Failed: ${ResultDesc}`);
      }
      
      console.log("\n" + "=".repeat(50));
    }
    
    // Always return success to M-Pesa
    return NextResponse.json({ 
      ResultCode: 0, 
      ResultDesc: "Success" 
    });
    
  } catch (err: any) {
    console.error("Callback Error:", err);
    // Still return success to M-Pesa to avoid retries
    return NextResponse.json({ 
      ResultCode: 0, 
      ResultDesc: "Success" 
    });
  }
}