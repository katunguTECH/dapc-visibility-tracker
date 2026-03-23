import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const res = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });

    const data = await res.json();
    const topResult = data.places?.[0];

    // --- THE IDENTITY GUARD ---
    const queryBase = businessQuery.toLowerCase().slice(0, 4); // Take first 4 chars
    const resultTitle = topResult?.title?.toLowerCase() || "";
    
    // Check 1: Does the result title actually contain the start of the query?
    // Check 2: Is the result just the word "Nairobi" or "Kenya" (Google's fallback)?
    const isFallback = resultTitle === "nairobi" || resultTitle === "kenya";
    const isMatch = resultTitle.includes(queryBase);

    if (!topResult || isFallback || !isMatch) {
      return NextResponse.json({
        score: 0,
        rank: "N/A",
        businessName: "Unknown Entity",
        status: "Match Failed: No legitimate business found for this query.",
        recs: ["Please ensure the business is registered on Google Maps."]
      });
    }

    // --- DYNAMIC SCORING (Only for real matches) ---
    let score = 10;
    let recs = [];

    if (topResult.address && topResult.address.length > 15) {
      score += 25;
      recs.push("✅ Local Legend: Physical presence verified.");
    }
    if (topResult.phoneNumber) {
      score += 30;
      recs.push("✅ Contact Ready: Direct line found.");
    }
    if (topResult.website) {
      score += 34;
      recs.push("✅ Search Reach: Professional site detected.");
    }

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in Nairobi`,
      businessName: topResult.title,
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website,
      recs,
      status: "Verified digital identity found."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "Error" });
  }
}