import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "Nairobi";

  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: `${business} ${location}`, gl: "ke" })
    });

    const data = await response.json();

    // --- NEW PRECISION SCORING ENGINE ---
    let score = 15; // Lowered base to 15 for better differentiation
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 1. ELITE BRAND CHECK (Knowledge Graph / Answer Box Only)
    const isEliteBrand = !!(data.knowledgeGraph || data.answerBox);
    
    if (isEliteBrand) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as a verified major entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No verified Google Brand identity detected.");
    }

    // 2. MAPS & LOCAL CHECK
    const localData = data.localResults || data.places || [];
    if (localData.length > 0) {
      const topMatch = localData[0];
      score += 25; // Increased weight for Maps
      ranking = `#${topMatch.position || 1} in ${location}`;
      rating = `${topMatch.rating || "4.0"} ⭐`;
      recs.push(`✅ Local Legend: Business is verified and visible on Google Maps.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${location} can't find your physical location.`);
    }

    // 3. ORGANIC SEO & SITELINKS CHECK
    if (data.organic && data.organic.length > 0) {
      score += 10;
      // Sitelinks are now a bonus for SEO, not a Brand Authority trigger
      const hasSitelinks = !!(data.organic[0]?.sitelinks && data.organic[0].sitelinks.length > 0);
      if (hasSitelinks) {
        score += 5; 
        recs.push("✅ SEO Excellence: Professional site with deep links (sitelinks) detected.");
      } else {
        recs.push("✅ SEO Presence: Active website found in organic search.");
      }
    } else {
      recs.push("❌ SEO Gap: No organic website results found.");
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs,
      timestamp: Date.now()
    }), {
      headers: { 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 0, ranking: "Error" });
  }
}