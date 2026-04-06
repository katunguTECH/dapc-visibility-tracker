import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    console.log("RAW CALLBACK:", JSON.stringify(data, null, 2));

    const result = data.Body?.stkCallback;

    if (!result) {
      return NextResponse.json({ message: "Invalid callback" }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = result;

    console.log("STK CALLBACK:", result);

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];

      const amount = items.find((i: any) => i.Name === "Amount")?.Value;
      const receipt = items.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;
      const phone = items.find((i: any) => i.Name === "PhoneNumber")?.Value;

      console.log("✅ PAYMENT SUCCESS:");
      console.log("Phone:", phone);
      console.log("Amount:", amount);
      console.log("Receipt:", receipt);

      return NextResponse.json({ success: true });
    } else {
      console.warn("❌ PAYMENT FAILED:", ResultDesc);
      return NextResponse.json({ success: false, message: ResultDesc });
    }

  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return NextResponse.json({ message: "Callback failed" }, { status: 500 });
  }
}