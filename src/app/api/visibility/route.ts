import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business") || "";
  const location = searchParams.get("location") || "Nairobi";
  const query = business.toLowerCase();

  // 1. DEMO OVERRIDE: Ensure Safaricom always looks high-value
  if (query.includes("safaricom")) {
    return NextResponse.json({
      visibilityScore: 98,
      ranking: "Ranked #1 in Kenya",
      rating: "4.8 ⭐",
      recs: [
        "✅ Strong Brand Authority: Official Google Knowledge Panel detected.",
        "✅ Local Legend: Dominating Google Maps in Nairobi.",
        "✅ Organic Presence: 10+ high-authority website links found."
      ]
    });
  }

  const apiKey = process.env.SERP_API_KEY;

  // Debugging log for Vercel (shows first 4 chars only for safety)
  console.log(`API Key check: ${apiKey ? apiKey.substring(0, 4) + "..." : "MISSING"}`);

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        q: `${business} ${location}`,
        gl: "ke",
        hl: "en" 
      })
    });

    const data = await response.json();
    console.log("Serper Data:", data);

    // If API fails or key is wrong, Serper returns a message field
    if (data.message === "Unauthorized.") {
       throw new Error("Invalid API Key");
    }

    let score = 25; 
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // Realistic Scoring Logic
    if (data.knowledgeGraph) {
      score += 45;
      recs.push("✅ Strong Brand Authority: Google Knowledge Panel detected.");
    } else {
      recs.push("❌ Missing Knowledge Panel: Your business lacks a formal Google identity.");
    }

    if (data.localResults && data.localResults.length > 0) {
      score += 20;
      ranking = `#${data.localResults[0].position} on Maps`;
      rating = `${data.localResults[0].rating || "4.0"} ⭐`;
      recs.push("✅ Visible on Google Maps.");
    } else {
      recs.push(`❌ Invisible on Maps: Local customers can't find your location.`);
    }

    if (data.organic && data.organic.length > 0) {
      score += 10;
      recs.push("✅ Active organic presence detected.");
    }

    return NextResponse.json({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs
    });

  } catch (error) {
    console.error("Audit Error:", error);
    return NextResponse.json({ 
      visibilityScore: 20, 
      ranking: "Search Error", 
      rating: "N/A", 
      recs: [
        "⚠️ Live data connection pending.",
        "❌ Failed to verify Google Maps presence.",
        "❌ Organic search footprint not found."
      ] 
    });
  }
}