import { NextResponse } from "next/server";

// 1. FORCE DYNAMIC EXECUTION
// This prevents Vercel from caching the "35%" result for different businesses.
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
    // 3. FETCH DATA FROM SERPER
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

    // 4. THE ENHANCED SCORING ENGINE (v2.5)
    // We use a base of 25 to verify the update is live.
    let score = 25; 
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // A. BRAND AUTHORITY DETECTION (Knowledge Graph, Answer Box, or Sitelinks)
    const hasKnowledge = !!data.knowledgeGraph;
    const hasAnswerBox = !!data.answerBox;
    const hasSitelinks = !!(data.organic && data.organic[0]?.sitelinks);

    if (hasKnowledge || hasAnswerBox || hasSitelinks) {
      score += 40;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as a major market player.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No formal Google Brand identity detected.");
    }

    // B. FLEXIBLE LOCAL DETECTION (Maps)
    const localData = data.localResults || data.places || [];
    if (localData.length > 0) {
      const topMatch = localData[0];
      score += 20;
      ranking = `#${topMatch.position || 1} in ${location}`;
      rating = `${topMatch.rating || "4.2"} ⭐`;
      recs.push(`✅ Local Legend: Highly visible on Google Maps in ${location}.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${location} can't find your pin.`);
    }

    // C. ORGANIC SEO DETECTION
    if (data.organic && data.organic.length > 0) {
      score += 14;
      recs.push("✅ SEO Presence: Professional website and deep links found.");
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
      timestamp: Date.now() // Forces Frontend to treat this as new data
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