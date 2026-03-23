import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery) return NextResponse.json({ score: 0, status: "No name provided" });

  try {
    // --- STEP 1: FETCH THE SPECIFIC BUSINESS DATA ---
    const bizRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, location: `${locationInput}, Kenya`, gl: "ke" })
    });
    const bizData = await bizRes.json();
    const targetBus = bizData.places?.[0];

    // GIBBERISH CHECK: If name doesn't match at all, kill the audit
    if (!targetBus || !targetBus.title.toLowerCase().includes(businessQuery.toLowerCase().split(' ')[0])) {
      return NextResponse.json({ score: 0, rank: "N/A", status: "Business not found." });
    }

    // --- STEP 2: FIND COMPETITIVE RANKING ---
    // We use the 'category' Google assigned them (e.g., "Coffee Shop" or "Telecommunications")
    const category = targetBus.category || "Business";
    const compRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in ${locationInput}`, gl: "ke" })
    });
    const compData = await compRes.json();
    const competitors = compData.places || [];

    // Find our target business in the competitive list
    const rankIndex = competitors.findIndex((p: any) => 
      p.title.toLowerCase().includes(targetBus.title.toLowerCase()) || 
      p.address === targetBus.address
    );

    // If not in top 20 of category, rank is low
    const displayRank = rankIndex !== -1 ? `#${rankIndex + 1}` : "Ranked > 20";

    // --- STEP 3: DYNAMIC SCORING ---
    let score = 10; // Base match
    let recs = [];

    // Rank Bonus (0-30 points)
    if (rankIndex !== -1) {
      score += Math.max(30 - (rankIndex * 2), 5); // #1 gets 30, #10 gets 10
      recs.push(rankIndex < 3 ? "✅ Local Legend: Dominating the neighborhood." : "⚠️ Competition: You are visible but others rank higher.");
    } else {
      recs.push("❌ Visibility Gap: You don't appear in the top 20 for your category.");
    }

    // Data Completeness (60 points)
    if (targetBus.address) score += 15;
    if (targetBus.phoneNumber) score += 15;
    if (targetBus.website) score += 15;
    if (targetBus.ratingCount > 50) score += 15;
    else if (targetBus.ratingCount > 0) score += 5;

    return new NextResponse(JSON.stringify({
      score: Math.min(score, 99),
      rank: `${displayRank} in ${locationInput}`,
      businessName: targetBus.title,
      category: targetBus.category,
      trust: targetBus.rating ? `${targetBus.rating} ⭐ (${targetBus.ratingCount})` : "Verified",
      address: targetBus.address,
      phoneNumber: targetBus.phoneNumber,
      website: targetBus.website,
      recs,
      status: "Verified digital identity found."
    }), { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    return NextResponse.json({ score: 0, error: "System error" });
  }
}