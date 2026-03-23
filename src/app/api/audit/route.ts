import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery) return NextResponse.json({ score: 0, status: "Invalid Input" });

  try {
    // STEP 1: Identify the Business
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    // Validation: Check if the result actually matches the query
    if (!target || !target.title.toLowerCase().includes(businessQuery.toLowerCase().split(' ')[0])) {
      return NextResponse.json({ score: 0, status: "Match Failed" });
    }

    // STEP 2: Find Competitors in the same Category
    const category = target.category || "Business";
    const compRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in ${locationInput}`, gl: "ke", num: 10 })
    });
    const compData = await compRes.json();
    const allPlaces = compData.places || [];

    // Calculate Rank
    const rankIndex = allPlaces.findIndex((p: any) => p.title === target.title);
    const finalRank = rankIndex !== -1 ? `#${rankIndex + 1}` : "Unranked (>10)";

    // Calculate Score
    let score = 20;
    if (target.address) score += 20;
    if (target.phoneNumber) score += 20;
    if (target.website) score += 20;
    if (rankIndex !== -1 && rankIndex < 3) score += 19;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `${finalRank} in ${locationInput}`,
      businessName: target.title,
      category: category,
      address: target.address,
      phoneNumber: target.phoneNumber,
      website: target.website,
      trust: target.rating ? `${target.rating} ⭐ (${target.ratingCount})` : "Verified",
      // Map top 3 competitors for the UI
      competitors: allPlaces.slice(0, 3).map((c: any, i: number) => ({
        rank: i + 1,
        title: c.title,
        rating: c.rating || "N/A",
        reviews: c.ratingCount || 0,
        hasWebsite: !!c.website
      }))
    });

  } catch (error) {
    return NextResponse.json({ score: 0, error: "API Error" });
  }
}