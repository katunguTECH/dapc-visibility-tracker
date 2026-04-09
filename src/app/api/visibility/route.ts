import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const business = url.searchParams.get("business");

    console.log("STEP 1: API HIT");
    console.log("Business:", business);

    if (!business) {
      return NextResponse.json({ error: "No business" }, { status: 400 });
    }

    const apiKey = process.env.SERPER_API_KEY;

    console.log("STEP 2: KEY CHECK:", apiKey ? "FOUND" : "MISSING");

    if (!apiKey) {
      return NextResponse.json(
        { error: "SERPER KEY MISSING" },
        { status: 500 }
      );
    }

    console.log("STEP 3: CALLING SERPER...");

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${business} Nairobi Kenya`,
      }),
    });

    console.log("STEP 4: RESPONSE STATUS:", res.status);

    const text = await res.text();
    console.log("STEP 5: RAW RESPONSE:", text.slice(0, 200));

    if (!res.ok) {
      return NextResponse.json(
        { error: "Serper failed", status: res.status, body: text },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "API WORKING",
    });

  } catch (err: any) {
    console.error("CRASH:", err);
    return NextResponse.json(
      { error: "CRASH", message: err.message },
      { status: 500 }
    );
  }
}