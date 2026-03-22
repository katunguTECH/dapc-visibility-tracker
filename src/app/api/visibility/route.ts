import { NextResponse } from "next/server";

// FORCE DYNAMIC: This prevents Next.js from caching the API response
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "Nairobi";

  // 1. CLEAN THE API KEY: Strip any accidental quotes or spaces
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!apiKey) {
    return NextResponse.json({ 
      visibilityScore: 10, 
      ranking: "Config Error",
      recs: ["⚠️ API Key not found. Please check Vercel Environment Variables."]
    });
  }

  try {
    // 2. FETCH REAL DATA: Added cache: 'no-store' to bypass Edge Caching
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      cache: 'no-store', // CRITICAL: Forces a fresh call for every business name
      body: JSON.stringify({ 
        q: `${business} ${location}`,
        gl: "ke", 
        hl: "en" 
      })
    });

    const data = await response.json();

    // Handle Serper-specific Auth errors
    if (data.message === "Unauthorized.") {
      return NextResponse.json({ 
        visibilityScore: 20, 
        ranking: "Auth Error",
        recs: ["❌ API Key rejected. Please refresh the key in Serper.dev."] 
      });
    }

    let score = 25; // Base score for a business that exists
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 3. DYNAMIC SCORING LOGIC
    // Check Knowledge Graph (Brand Authority)
    if (data.knowledgeGraph) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an established entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: Your business lacks a formal Google identity.");
    }

    // Check Local Results (Maps)
    if (data.localResults && data.localResults.length > 0) {
      const bestMatch = data.localResults[0];
      score += 20;
      ranking = `#${bestMatch.position} in ${location} Maps`;
      rating = `${bestMatch.rating || "4.0"} ⭐`;
      recs.push(`✅ Map Presence: Visible to local customers in ${location}.`);
    } else {
      recs.push(`❌ Invisible on Maps: Customers in ${location} can't find your physical location.`);
    }

    // Check Organic Results (SEO)
    if (data.organic && data.organic.length > 0) {
      score += 10;
      recs.push("✅ SEO Presence: Your website appears in organic search results.");
    } else {
      recs.push("❌ SEO Gap: No organic website links found for this search.");
    }

    // Final safety check for very low results
    if (score <= 25 && !data.organic) {
      score = 15;
      recs = ["⚠️ Low Digital Footprint: Business not found in major search indices."];
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