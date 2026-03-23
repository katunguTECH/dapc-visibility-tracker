import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!business) return NextResponse.json({ score: 0 });

  try {
    // 1. Get the target business details & its CATEGORY
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    if (!target) return NextResponse.json({ score: 11, rank: "Not Found" });

    // 2. RUN REAL CATEGORY SEARCH (e.g., "Lounge in Nairobi")
    const category = target.category || "Business";
    const discRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in Nairobi`, gl: "ke", num: 20 })
    });
    const discData = await discRes.json();
    const competitors = discData.places || [];

    // 3. FIND ACTUAL RANK
    // We look for the target business inside the top 20 category results
    const actualRankIndex = competitors.findIndex((p: any) => 
      p.title.toLowerCase().includes(target.title.toLowerCase()) || 
      (p.address && target.address && p.address.substring(0, 10) === target.address.substring(0, 10))
    );

    // If they aren't in the top 20, we assign a low rank
    const finalRank = actualRankIndex !== -1 ? `#${actualRankIndex + 1}` : "Ranked > 20";

    // 4. CALCULATE REALISTIC SCORE
    let score = 15; // Base
    if (target.website) score += 20;
    if (target.phoneNumber) score += 10;
    
    // Rank logic: Only the top 3 get high points
    if (actualRankIndex === 0) score += 40; 
    else if (actualRankIndex > 0 && actualRankIndex < 5) score += 20;
    else if (actualRankIndex >= 5) score += 5;

    // Cap small brands to keep them "hungry" for your services
    const reviewCount = target.user_ratings_total || 0;
    const isMegaBrand = reviewCount > 2000;
    const finalScore = isMegaBrand ? Math.min(score, 99) : Math.min(score, 58);

    return NextResponse.json({
      score: Math.max(finalScore, 11),
      rank: `${finalRank} in Nairobi`,
      businessName: target.title,
      address: target.address,
      trust: `${target.rating || 0} ⭐ (${reviewCount})`,
      leads: {
        phone: target.phoneNumber || "Not Found",
        whatsapp: target.phoneNumber || "Not Found",
        email: "Not Found - Scan Website",
        socials: "Check FB/IG"
      }
    });

  } catch (error) {
    return NextResponse.json({ score: 0 });
  }
}