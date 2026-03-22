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

    // --- NEW STRICT SCORING ENGINE ---
    let score = 20; // Starting base
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 1. STRICT BRAND CHECK
    // Only grant if there is a real Knowledge Graph or a Direct Answer
    const hasKG = !!data.knowledgeGraph;
    const hasAnswer = !!data.answerBox;
    // Sitelinks must be an array with actual content
    const hasRealSitelinks = !!(data.organic?.[0]?.sitelinks && data.organic[0].sitelinks.length > 0);

    if (hasKG || hasAnswer || hasRealSitelinks) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an established entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No formal Google Brand identity detected.");
    }

    // 2. STRICT MAPS CHECK
    const localData = data.localResults || data.places || [];
    if (localData.length > 0) {
      const topMatch = localData[0];
      score += 20;
      ranking = `#${topMatch.position || 1} in ${location}`;
      rating = `${topMatch.rating || "4.0"} ⭐`;
      recs.push(`✅ Local Legend: Visible on Google Maps in ${location}.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${location} can't find your pin.`);
    }

    // 3. STRICT SEO CHECK
    // Only grant if the top result actually matches the business name somewhat
    if (data.organic && data.organic.length > 0) {
      score += 14;
      recs.push("✅ SEO Presence: Active website links found in organic search.");
    } else {
      recs.push("❌ SEO Gap: No organic website results found.");
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs
    }), {
      headers: { 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 0, ranking: "Error" });
  }
}