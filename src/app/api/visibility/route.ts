import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.toLowerCase().trim() || "";
  const location = searchParams.get("location") || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const response = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${businessQuery} ${location}`, gl: "ke" })
    });

    const data = await response.json();
    const places = data.places || [];
    
    // --- THE VALIDATION LOGIC ---
    // 1. Check if we found ANYTHING
    if (places.length === 0) {
      return NextResponse.json({ score: 0, rank: "Not Found", status: "No listings found." });
    }

    // 2. Check if the first result is actually a match (Anti-Gibberish)
    const topResult = places[0];
    const foundName = topResult.title.toLowerCase();
    
    // Logic: If search term isn't in the title AND title isn't in the search term, it's a fake match
    const isRealMatch = foundName.includes(businessQuery) || businessQuery.includes(foundName);

    if (!isRealMatch) {
      return NextResponse.json({ 
        score: 5, 
        rank: "Unranked", 
        businessName: "Unknown",
        status: "Business not found. Showing closest local generic result.",
        details: { googleFound: topResult.title }
      });
    }

    // 3. Dynamic Ranking
    // If the business is specifically searched for, we check its position
    const rankValue = topResult.position || 1; 

    // 4. Dynamic Scoring based on Profile Completeness
    let score = 30; // Base points for existing
    if (topResult.phoneNumber) score += 20;
    if (topResult.website) score += 20;
    if (topResult.ratingCount > 10) score += 20;
    if (topResult.address) score += 10;

    return NextResponse.json({
      score: Math.min(score, 100),
      rank: `#${rankValue} in ${location}`,
      businessName: topResult.title,
      trust: `${topResult.rating || 0} ⭐ (${topResult.ratingCount || 0})`,
      verified: !!topResult.cid,
      address: topResult.address
    });

  } catch (error) {
    return NextResponse.json({ error: "Audit failed" }, { status: 500 });
  }
}