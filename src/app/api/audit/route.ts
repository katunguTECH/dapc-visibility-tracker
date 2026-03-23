import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery) return NextResponse.json({ score: 0 });

  try {
    // 1. IDENTITY CHECK: Find the business to get its official "Category"
    const idRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });
    const idData = await idRes.json();
    const target = idData.places?.[0];

    // GIBBERISH BOUNCER: If the result doesn't match the query, return 0
    if (!target || !target.title.toLowerCase().includes(businessQuery.toLowerCase().split(' ')[0])) {
      return NextResponse.json({ score: 11, rank: "Not Found", status: "Invisible" });
    }

    // 2. DISCOVERY SEARCH: Search by Category in the Location
    const category = target.category || "Business";
    const discRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${category} in ${locationInput}`, gl: "ke", num: 20 })
    });
    const discData = await discRes.json();
    const competitors = discData.places || [];

    // 3. FIND ACTUAL RANK: Where does the target sit in the competitor list?
    const rankIndex = competitors.findIndex((p: any) => 
      p.title.toLowerCase().includes(target.title.toLowerCase()) || 
      p.address === target.address
    );

    const finalRank = rankIndex !== -1 ? `#${rankIndex + 1}` : "Ranked > 20";

    // 4. WEIGHTED SCORING
    let score = 20; 
    if (rankIndex === 0) score += 30; // Bonus for being #1
    else if (rankIndex > 0 && rankIndex < 5) score += 20; // Top 5
    
    if (target.website) score += 20;
    if (target.phoneNumber) score += 15;
    if (target.ratingCount > 10) score += 14;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `${finalRank} in ${locationInput}`,
      businessName: target.title,
      category: category,
      trust: target.rating ? `${target.rating} ⭐ (${target.ratingCount})` : "Verified",
      recs: rankIndex > 2 ? ["⚠️ High Competition: Competitors are outranking you."] : ["✅ Local Legend: Dominating your category."],
      status: "Verified digital identity found."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "Error" });
  }
}