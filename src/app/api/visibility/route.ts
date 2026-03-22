import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "Nairobi";

  // 1. STRIP GHOST CHARACTERS: Removes any accidental quotes or spaces from Vercel
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!apiKey) {
    return NextResponse.json({ 
      visibilityScore: 10, 
      ranking: "Config Error",
      recs: ["⚠️ API Key not found in Vercel. Please check Settings > Environment Variables."]
    });
  }

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        q: `${business} ${location}`,
        gl: "ke", // Kenya specific
        hl: "en" 
      })
    });

    const data = await response.json();

    // Handle Serper-specific errors
    if (data.message === "Unauthorized.") {
      return NextResponse.json({ 
        visibilityScore: 20, 
        ranking: "Auth Error",
        recs: ["❌ The Serper API rejected your key. Regenerate it at serper.dev."] 
      });
    }

    let score = 30; // Base score for any business found
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 2. DYNAMIC SCORING (LIVE FOR ALL COMPANIES)
    if (data.knowledgeGraph) {
      score += 40;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an official entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: Your business lacks a formal Google identity.");
    }

    if (data.localResults && data.localResults.length > 0) {
      const bestMatch = data.localResults[0];
      score += 20;
      ranking = `#${bestMatch.position} in ${location} Maps`;
      rating = `${bestMatch.rating || "4.0"} ⭐`;
      recs.push(`✅ Map Presence: Visible to local customers in ${location}.`);
    } else {
      recs.push(`❌ Invisible on Maps: Customers in ${location} can't find your location.`);
    }

    if (data.organic && data.organic.length > 0) {
      score += 9;
      recs.push("✅ SEO Presence: Found in organic search results.");
    }

    // 3. LOGIC FOR SMALL BUSINESSES
    if (recs.length === 0) {
      score = 15;
      recs.push("⚠️ Low Digital Footprint: Business not found in top search indices.");
    }

    return NextResponse.json({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs
    });

  } catch (error) {
    console.error("Audit Engine Failure:", error);
    return NextResponse.json({ 
      visibilityScore: 20, 
      ranking: "System Error", 
      recs: ["⚠️ Connection to Google interrupted. Please try again."] 
    });
  }
}