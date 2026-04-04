// src/app/api/mpesa/stk-push/route.ts
export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, planName } = await req.json();

    if (!phoneNumber || !amount) {
      return new Response(JSON.stringify({ success: false, message: "Missing phone number or amount" }), { status: 400 });
    }

    let phone = phoneNumber.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "254" + phone.slice(1);
    else if (phone.startsWith("7")) phone = "254" + phone;

    const consumerKey = process.env.MPESA_CONSUMER_KEY!;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const env = process.env.MPESA_ENV || "sandbox";

    // 1. Get token
    const tokenRes = await fetch(`${env === "sandbox" ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke"}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: "Basic " + Buffer.from(consumerKey + ":" + consumerSecret).toString("base64") },
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // 2. Send STK Push
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
    const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");

    const stkRes = await fetch(`${env === "sandbox" ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke"}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: "https://dapc.co.ke/api/mpesa/callback",
        AccountReference: planName,
        TransactionDesc: planName,
      }),
    });

    const data = await stkRes.json();
    if (data.ResponseCode === "0") return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    else return new Response(JSON.stringify({ success: false, data }), { status: 400 });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}