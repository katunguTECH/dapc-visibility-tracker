import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business") || "";
  const location = searchParams.get("location") || "Nairobi";

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERP_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: `${business} ${location}` })
    });

    const data = await response.json();

    let score = 15;
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // Logic for Recommendations
    if (data.knowledgeGraph) {
      score += 50;
      recs.push("✅ Strong Brand Authority detected via Google Knowledge Graph.");
    } else {
      recs.push("❌ Missing Brand Knowledge Panel. Your business lacks a formal Google identity.");
    }

    if (data.localResults && data.localResults.length > 0) {
      score += 25;
      ranking = `#${data.localResults[0].position} on Maps`;
      rating = data.localResults[0].rating?.toString() || "4.0";
      recs.push("✅ Business visible on Google Maps.");
    } else {
      recs.push(`❌ Not visible on ${location} Maps. Local customers cannot find your physical location.`);
    }

    if (!data.organic || data.organic.length < 3) {
      recs.push("❌ Low Search Footprint. You aren't appearing in enough organic search results.");
    } else {
      score += 10;
      recs.push("✅ Active organic presence detected.");
    }

    return NextResponse.json({
      visibilityScore: Math.min(score, 98),
      ranking,
      rating,
      recs // New recommendations array
    });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 20, ranking: "Error", rating: "N/A", recs: ["Could not verify data."] });
  }
}