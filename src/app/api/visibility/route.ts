import { NextResponse } from "next/server";

// 1. ABSOLUTE DYNAMIC CONFIGURATION
// These force Vercel to bypass all caches and run the code every single time.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location")?.trim() || "Nairobi";

  // 2. CLEAN THE API KEY
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!apiKey) {
    return NextResponse.json({ 
      visibilityScore: 5, 
      ranking: "Config Error",
      recs: ["⚠️ API Key missing in Vercel Environment Variables."]
    });
  }

  try {
    // 3. FETCH FROM SERPER WITH NO-STORE
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify({ 
        q: `${business} ${location}`,
        gl: "ke", 
        hl: "en" 
      })
    });

    const data = await response.json();

    // 4. THE SCORING ENGINE (Updated to break the 35% barrier)
    // We use 22 as a "marker" so you know the new code is live.
    let score = 22; 
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // A. Knowledge Graph Detection (Safaricom/Big Brands)
    if (data.knowledgeGraph) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an official Kenyan entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No formal Google Brand identity detected.");
    }

    // B. Google Maps Detection (Local SEO)
    if (data.localResults && data.localResults.length > 0) {
      const topMatch = data.localResults[0];
      score += 20;
      ranking = `#${topResult?.position || 1} in ${location}`;
      rating = `${topResult?.rating || "4.5"} ⭐`;
      recs.push(`✅ Local Legend: Highly visible on Google Maps in ${location}.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${location} can't find your pin.`);
    }

    // C. Organic SEO Detection
    if (data.organic && data.organic.length > 0) {
      score += 12;
      recs.push("✅ SEO Presence: Active website and links found in organic search.");
    } else {
      recs.push("❌ SEO Gap: No organic website results found.");
    }

    // 5. SEND RESPONSE WITH ANTI-CACHE HEADERS
    const finalScore = Math.min(score, 99);
    
    return new NextResponse(JSON.stringify({
      visibilityScore: finalScore,
      ranking,
      rating,
      recs,
      timestamp: Date.now() // Unique ID to force React update
    }), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error("DAPC Backend Error:", error);
    return NextResponse.json({ 
      visibilityScore: 0, 
      ranking: "System Error", 
      recs: ["⚠️ Audit Engine connection failed."] 
    });
  }
}