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
      body: JSON.stringify({ q: `${business} ${location}`, gl: "ke", hl: "en" })
    });

    const data = await response.json();

    let score = 15; 
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 1. ROBUST BRAND DETECTION
    // Checks for Knowledge Graph OR Answer Box OR the 'Sitelinks' count (Major brands have 4+)
    const hasKG = !!data.knowledgeGraph;
    const hasAnswer = !!data.answerBox;
    const hasDeepLinks = !!(data.organic?.[0]?.sitelinks && data.organic[0].sitelinks.length >= 3);

    if (hasKG || hasAnswer || hasDeepLinks) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an established entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No verified Google Brand identity detected.");
    }

    // 2. ROBUST MAPS DETECTION
    // Look in 'localResults', 'places', or 'topAds' (sometimes businesses buy ads for their location)
    const localMatches = data.localResults || data.places || [];
    
    if (localMatches.length > 0) {
      const topMatch = localMatches[0];
      score += 25;
      ranking = `#${topMatch.position || 1} in ${location}`;
      rating = `${topMatch.rating || "4.0"} ⭐ (${topMatch.reviews || 0} reviews)`;
      recs.push(`✅ Local Legend: Business is verified and visible on Google Maps.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${location} can't find your physical location.`);
    }

    // 3. SEO CHECK
    if (data.organic && data.organic.length > 0) {
      score += 15;
      if (hasDeepLinks) {
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