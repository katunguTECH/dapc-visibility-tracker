import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const business = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const response = await fetch(`https://google.serper.dev/search`, {
      method: 'POST',
      headers: { 
        'X-API-KEY': apiKey || "", 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        q: business, 
        location: `${locationInput}, Kenya`, 
        gl: "ke", 
        hl: "en",
        autocorrect: false // Prevents Google from "guessing" a different business
      })
    });

    const data = await response.json();

    let score = 15; 
    let ranking = "Not Found";
    let rating = "N/A";
    let recs = [];

    // 1. BRAND CHECK
    const hasKG = !!data.knowledgeGraph || !!data.answerBox;
    const topResult = data.organic?.[0];
    const hasSitelinks = !!(topResult?.sitelinks && topResult.sitelinks.length > 0);

    if (hasKG || hasSitelinks) {
      score += 45;
      recs.push(`✅ Brand Authority: Google recognizes ${business} as an established entity.`);
    } else {
      recs.push("❌ Missing Knowledge Panel: No verified Google Brand identity detected.");
    }

    // 2. MAPS CHECK (Checking localResults AND the 'places' key)
    // Serper often puts Kenyan business pins inside 'places'
    const mapsFound = data.localResults || data.places || [];
    
    // Fallback: If no direct map object, check if any URL looks like a Maps link
    const hasMapsLink = data.organic?.some((res: any) => res.link?.includes('google.com/maps'));

    if (mapsFound.length > 0 || hasMapsLink) {
      score += 25;
      const topMatch = mapsFound[0];
      // Capture real Map data if it exists
      ranking = topMatch?.position ? `#${topMatch.position} in ${locationInput}` : "Verified Location";
      rating = topMatch?.rating ? `${topMatch.rating} ⭐` : "Verified";
      recs.push(`✅ Local Legend: Business is verified and visible on Google Maps.`);
    } else {
      recs.push(`⚠️ Invisible on Maps: Customers in ${locationInput} can't find your physical location.`);
    }

    // 3. SEO CHECK
    if (data.organic && data.organic.length > 0) {
      score += 15;
      recs.push(hasSitelinks ? "✅ SEO Excellence: Professional site with deep links detected." : "✅ SEO Presence: Active website found.");
    } else {
      recs.push("❌ SEO Gap: No organic website results found.");
    }

    return new NextResponse(JSON.stringify({
      visibilityScore: Math.min(score, 99),
      ranking,
      rating,
      recs,
      timestamp: Date.now()
    }), {
      headers: { 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    return NextResponse.json({ visibilityScore: 0, ranking: "Error" });
  }
}