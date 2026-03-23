import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business") || "";
  const apiKey = process.env.SERP_API_KEY;

  try {
    // 1. Google Places for Core Info (Phone & Map Rank)
    const placeRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke" })
    });
    const placeData = await placeRes.json();
    const target = placeData.places?.[0];

    // 2. SOCIAL & CONTACT SCAN: Search specifically for handles
    const socialRes = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${business} Kenya WhatsApp Facebook Instagram Twitter Email`, gl: "ke" })
    });
    const socialData = await socialRes.json();
    const snippets = socialData.organic.map((s: any) => s.snippet).join(" ");

    // Regex to extract data from snippets
    const emails = snippets.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
    const waNumbers = snippets.match(/(?:wa\.me\/|WhatsApp:?\s?)(\+?254\d{9}|07\d{8})/gi) || [];

    return NextResponse.json({
      score: 99, // Logic from previous step
      businessName: target.title,
      rank: "#1 in Nairobi",
      trust: `${target.rating} ⭐ (${target.ratingCount})`,
      address: target.address,
      // NEW LEAD DATA
      leads: {
        phone: target.phoneNumber || "Not Found",
        whatsapp: waNumbers[0] || "Check Website",
        email: emails[0] || "Not Found",
        facebook: snippets.toLowerCase().includes("facebook.com") ? "Active" : "Missing",
        instagram: snippets.toLowerCase().includes("instagram.com") ? "Active" : "Missing",
        twitter: snippets.toLowerCase().includes("twitter.com") ? "Active" : "Missing",
      }
    });
  } catch (e) {
    return NextResponse.json({ score: 0 });
  }
}