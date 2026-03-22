import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    // 1. PRIMARY SEARCH
    const searchRes = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: business, gl: "ke", location: `${locationInput}, Kenya` })
    });
    const data = await searchRes.json();

    let score = Math.floor(Math.random() * 5) + 10; 
    let recs = [];
    let ranking = "Not Found";
    let rating = "N/A";

    // --- BRAND & SEO (Works) ---
    const hasBrand = !!(data.knowledgeGraph || data.answerBox || data.organic?.[0]?.sitelinks);
    if (hasBrand) {
      score += 35;
      recs.push(`✅ Brand Authority: Established entity.`);
    }
    if (data.organic?.length > 0) {
      score += Math.min(data.organic.length * 2, 15);
      recs.push(`✅ Search Reach: Active online presence.`);
    }

    // --- NEW DIRECT MAPS FETCH ---
    // We use the specific 'places' endpoint which is more reliable for Kenyan pins
    const mapRes = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        q: `${business} ${locationInput}`, 
        gl: "ke" 
      })
    });
    const mapData = await mapRes.json();
    
    // Check 'places' array (the standard for this endpoint)
    const mapsFound = mapData.places || [];

    if (mapsFound.length > 0) {
      const top = mapsFound[0];
      score += 30; // Significant jump for being on the map
      ranking = top.position ? `#${top.position} in ${locationInput}` : "Verified Location";
      rating = top.rating ? `${top.rating} ⭐ (${top.reviews || 0})` : "Verified";
      recs.push(`✅ Local Legend: Visible on Google Maps.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: No local pin detected in ${locationInput}.`);
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(Math.round(score), 99),
      ranking,
      rating,
      recs,
      timestamp: Date.now()
    }), { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    console.error("DEBUG MAPS ERROR:", error);
    return NextResponse.json({ visibilityScore: 15, ranking: "Error" });
  }
}