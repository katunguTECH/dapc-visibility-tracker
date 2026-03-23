import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY;

  if (!business || business.length < 3) {
    return NextResponse.json({ score: 0, rank: "N/A", status: "Invalid Input" });
  }

  try {
    // STEP 1: Identity Lookup (Find what this business actually is)
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    // GIBBERISH FILTER: Strict name match
    if (!target || !target.title.toLowerCase().includes(business.toLowerCase().split(' ')[0])) {
      return NextResponse.json({ score: 0, rank: "Not Found", status: "Identity Failed" });
    }

    // STEP 2: Discovery Search (The Rank Finder)
    const category = target.category || "Business";
    const discRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in ${location}`, gl: "ke", num: 20 })
    });
    const discData = await discRes.json();
    const competitors = discData.places || [];

    // Find the index of the target business in the top 20 list
    const rankIndex = competitors.findIndex(p => 
      p.title.toLowerCase().includes(target.title.toLowerCase()) || p.address === target.address
    );

    const displayRank = rankIndex !== -1 ? `#${rankIndex + 1}` : "Unranked (>20)";

    // STEP 3: Honest Scoring
    let score = 10;
    if (rankIndex === 0) score += 40; // Only #1 gets the big boost
    else if (rankIndex > 0 && rankIndex < 10) score += 25; 
    
    if (target.website) score += 20;
    if (target.phoneNumber) score += 15;
    if (target.ratingCount > 20) score += 14;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `${displayRank} in ${location}`,
      businessName: target.title,
      trust: target.rating ? `${target.rating} ⭐ (${target.ratingCount})` : "Verified",
      address: target.address,
      website: target.website,
      phoneNumber: target.phoneNumber,
      competitors: competitors.slice(0, 3).map((c, i) => ({
        name: c.title,
        rank: i + 1,
        rating: c.rating || "N/A"
      }))
    });

  } catch (error) {
    return NextResponse.json({ score: 0, error: "API Timeout" });
  }
}