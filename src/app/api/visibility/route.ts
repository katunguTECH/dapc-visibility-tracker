import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    // 1. PRIMARY SEARCH (For Brand and SEO)
    const searchRes = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke", hl: "en", location: `${locationInput}, Kenya` })
    });
    const data = await searchRes.json();

    let score = 15;
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // --- BRAND & SEO LOGIC (Verified Working) ---
    const hasBrand = !!(data.knowledgeGraph || data.answerBox || data.organic?.[0]?.sitelinks);
    if (hasBrand) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an established entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No verified Google Brand identity detected.");
    }

    if (data.organic?.length > 0) {
      score += 15;
      recs.push(data.organic[0].sitelinks ? "✅ SEO Excellence: Professional site with deep links." : "✅ SEO Presence: Active website found.");
    }

    // --- ENHANCED MAPS LOGIC ---
    let mapsFound = data.localResults || data.places || [];

    // 2. IF MAPS NOT FOUND, TRIGGER A DEDICATED MAP SEARCH
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
      const topMatch = mapsFound[0];
      score += 25;
      ranking = topMatch.address ? `Verified in ${locationInput}` : `#${topMatch.position || 1} Local Rank`;
      rating = topMatch.rating ? `${topMatch.rating} ⭐ (${topMatch.reviews || 0} reviews)` : "Verified";
      recs.push(`✅ Local Legend: Business is verified and visible on Google Maps.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${locationInput} can't find your pin.`);
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs,
      timestamp: Date.now()
    }), { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 0, ranking: "Error" });
  }
}