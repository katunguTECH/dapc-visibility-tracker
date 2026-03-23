import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery || businessQuery.length < 3) {
    return NextResponse.json({ score: 0, status: "Invalid Input" });
  }

  try {
    // --- STEP 1: IDENTITY CHECK ---
    // We find the specific business to get its official "Category"
    const identityRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });
    const identityData = await identityRes.json();
    const target = identityData.places?.[0];

    // --- GIBBERISH BOUNCER ---
    // If the name returned by Google doesn't contain any part of the user's query
    if (!target || !target.title.toLowerCase().includes(businessQuery.toLowerCase().split(' ')[0])) {
      return NextResponse.json({
        score: 0,
        rank: "N/A",
        businessName: "Unknown Entity",
        status: "Match Failed: This business does not appear to exist in the Kenyan registry.",
        recs: ["Check spelling or try a registered business name."]
      });
    }

    // --- STEP 2: THE DISCOVERY RANKING ---
    // Instead of searching the name, we search the CATEGORY in the LOCATION
    const category = target.category || "Business";
    const discoveryRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        q: `${category} in ${locationInput}`, 
        gl: "ke",
        num: 20 // Look at the top 20 competitors
      })
    });
    const discoveryData = await discoveryRes.json();
    const competitors = discoveryData.places || [];

    // Find our target in the list of local competitors
    const rankIndex = competitors.findIndex((p: any) => 
      p.title.toLowerCase() === target.title.toLowerCase() || p.address === target.address
    );

    const finalRank = rankIndex !== -1 ? `#${rankIndex + 1}` : "Unranked (>20)";

    // --- STEP 3: DYNAMIC SCORING ---
    let score = 10; 
    let recs = [];

    // Ranking Weight (30 points)
    if (rankIndex !== -1) {
      const rankBonus = Math.max(30 - (rankIndex * 3), 5); 
      score += rankBonus;
      recs.push(rankIndex < 3 ? "✅ Local Market Leader." : "⚠️ Competition is high in this area.");
    } else {
      recs.push("❌ Visibility Gap: You are invisible to customers searching by category.");
    }

    // Presence Weight (60 points)
    if (target.address && target.address.length > 15) score += 20;
    if (target.phoneNumber) score += 20;
    if (target.website) score += 20;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `${finalRank} in ${locationInput}`,
      businessName: target.title,
      category: category,
      trust: target.rating ? `${target.rating} ⭐ (${target.ratingCount})` : "Verified",
      address: target.address,
      phoneNumber: target.phoneNumber,
      website: target.website,
      recs,
      status: "Verified Kenyan market data retrieved."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "API Error" });
  }
}