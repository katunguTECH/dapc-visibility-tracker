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
    // 1. Get the first 3 letters of the search and the result
    const querySeed = businessQuery.toLowerCase().slice(0, 3);
    const resultTitle = topResult?.title?.toLowerCase() || "";
    
    // 2. Check if the result is just a generic city fallback (Nairobi/Kenya)
    const isFallback = resultTitle === "nairobi" || resultTitle === "kenya";
    
    // 3. Check if the result title actually starts with or contains the query seed
    const isLegitMatch = resultTitle.includes(querySeed);

    if (!topResult || isFallback || !isLegitMatch) {
      return NextResponse.json({
        score: 0,
        rank: "N/A",
        businessName: "Identity Verification Failed",
        status: "Match Failed: No legitimate business found for this query.",
        recs: ["Please ensure you are using a registered business name."]
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