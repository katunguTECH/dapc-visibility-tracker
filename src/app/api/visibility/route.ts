import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business") || "";
  const location = searchParams.get("location") || "Nairobi";

  // LOGGING: Check if API key exists
  const apiKey = process.env.SERP_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: SERP_API_KEY is missing from environment variables.");
  }

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        q: `${business} ${location}`,
        gl: "ke", // Target Kenya specifically
        hl: "en" 
      })
    });

    const data = await response.json();
    
    // LOGGING: See the actual response from Serper
    console.log("Serper API Response for:", business, data);

    let score = 20; // Base score
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 1. Check Knowledge Graph (Brand Authority)
    if (data.knowledgeGraph) {
      score += 40;
      recs.push("✅ Strong Brand Authority: You have an official Google Knowledge Panel.");
    } else {
      recs.push("❌ Missing Knowledge Panel: Google doesn't recognize you as a major brand entity yet.");
    }

    // 2. Check Local Results (Maps)
    if (data.localResults && data.localResults.length > 0) {
      score += 30;
      ranking = `Ranked #${data.localResults[0].position} in ${location}`;
      rating = data.localResults[0].rating ? `${data.localResults[0].rating} ⭐` : "4.0 ⭐";
      recs.push(`✅ Local Legend: You are visible on Google Maps in ${location}.`);
    } else {
      recs.push(`❌ Invisible on Maps: Local customers in ${location} can't see your physical location.`);
    }

    // 3. Check Organic Results (SEO)
    if (data.organic && data.organic.length > 0) {
      score += 10;
      recs.push("✅ Organic Presence: You are appearing in standard search results.");
    } else {
      recs.push("❌ SEO Gap: No organic website links found for this specific search.");
    }

    return NextResponse.json({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs
    });

  } catch (error) {
    console.error("Visibility Audit Error:", error);
    return NextResponse.json({ 
      visibilityScore: 15, 
      ranking: "Search Error", 
      rating: "N/A", 
      recs: ["⚠️ API Connection failed. Check your SERP_API_KEY in Vercel settings."] 
    });
  }
}