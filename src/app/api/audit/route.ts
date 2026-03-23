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

    // --- THE BOUNCER PROTOCOL ---
    
    // 1. Check if the result is a generic geographical location
    const isGenericLocation = 
      topResult?.category?.toLowerCase().includes("administrative") || 
      topResult?.category?.toLowerCase().includes("political") ||
      topResult?.title?.toLowerCase() === "nairobi" || 
      topResult?.title?.toLowerCase() === "kenya";

    // 2. Check for "Exact Match" or "Significant Overlap"
    const queryFirstWord = businessQuery.toLowerCase().split(' ')[0];
    const resultTitle = topResult?.title?.toLowerCase() || "";
    const isSignificantMatch = resultTitle.includes(queryFirstWord);

    // If it's a generic city result OR the name doesn't match at all... KILL IT.
    if (!topResult || isGenericLocation || !isSignificantMatch) {
      return NextResponse.json({
        score: 0,
        rank: "N/A",
        businessName: "Identity Not Found",
        status: "Match Failed: No legitimate business matching this query was found.",
        recs: ["Please check the spelling of your business name."]
      });
    }

    // --- SCORING (Only for real businesses) ---
    let score = 15;
    if (topResult.address && topResult.address.length > 15) score += 25;
    if (topResult.phoneNumber) score += 25;
    if (topResult.website) score += 25;
    if (topResult.ratingCount > 0) score += 9;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in Nairobi`,
      businessName: topResult.title,
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website,
      status: "Verified digital identity found."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "System Error" });
  }
}