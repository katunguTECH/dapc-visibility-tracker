import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const searchRes = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke", location: `${locationInput}, Kenya` })
    });
    const data = await searchRes.json();

    // 1. START WITH A NATURAL VARIANCE BASE (12-18)
    // This ensures even "empty" searches don't look identical.
    let score = Math.floor(Math.random() * 7) + 12; 
    let recs = [];
    let ranking = "Not Found";
    let rating = "N/A";

    // 2. SCALED BRAND AUTHORITY (0 - 40 points)
    const hasKG = !!data.knowledgeGraph;
    const hasAnswer = !!data.answerBox;
    const sitelinks = data.organic?.[0]?.sitelinks?.length || 0;

    if (hasKG || hasAnswer) {
      score += 35 + Math.floor(Math.random() * 5); // 35-40 points
      recs.push(`✅ High Authority: Established brand identity detected.`);
    } else if (sitelinks > 0) {
      score += 15 + (sitelinks * 2); // Scales based on how many sub-links they have
      recs.push(`✅ Emerging Authority: Professional digital footprint found.`);
    }

    // 3. SCALED MAPS VISIBILITY (0 - 30 points)
    let mapsFound = data.localResults || data.places || [];
    if (mapsFound.length === 0) {
      const mapRes = await fetch(`https://google.serper.dev/maps`, {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: `${business} ${locationInput}`, gl: "ke" })
      });
      const mapData = await mapRes.json();
      mapsFound = mapData.maps || [];
    }

    if (mapsFound.length > 0) {
      const top = mapsFound[0];
      const reviewCount = top.reviews || 0;
      const starRating = top.rating || 0;

      // Logic: More reviews + High stars = Higher score
      const reviewBonus = Math.min(Math.floor(reviewCount / 50), 10); // Max 10 pts for reviews
      const ratingBonus = Math.floor(starRating * 2); // Max 10 pts for stars
      
      score += (10 + reviewBonus + ratingBonus); 
      
      ranking = top.address ? `Verified in ${locationInput}` : `#${top.position || 1} Locally`;
      rating = `${starRating} ⭐ (${reviewCount} reviews)`;
      recs.push(`✅ Map Presence: ${reviewCount > 100 ? 'Dominant' : 'Active'} local listing.`);
    }

    // 4. SCALED SEO (0 - 15 points)
    const organicCount = data.organic?.length || 0;
    if (organicCount > 0) {
      // Score scales by how many results appear on Page 1
      score += Math.min(organicCount * 1.5, 15);
      recs.push(`✅ Search Reach: Ranked across ${organicCount} indexed pages.`);
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(Math.round(score), 99),
      ranking,
      rating,
      recs,
      timestamp: Date.now()
    }), { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 10, ranking: "Error" });
  }
}