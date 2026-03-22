import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery) {
    return NextResponse.json({ score: 0, status: "No business name provided." });
  }

  try {
    // 1. Fetch from Serper Places (The most accurate for local Kenyan businesses)
    const response = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 
        'X-API-KEY': apiKey || "", 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        q: businessQuery, 
        location: `${locationInput}, Kenya`, 
        gl: "ke", 
        hl: "en" 
      })
    });

    const data = await response.json();
    const topResult = data.places?.[0];

    // --- GUARD CLAUSE: NO RESULTS ---
    if (!topResult) {
      return NextResponse.json({ 
        score: 0, 
        rank: "N/A", 
        status: "No matching business found in this area." 
      });
    }

    // --- THE GIBBERISH KILLER (STRICT MATCHING) ---
    const foundName = topResult.title.toLowerCase();
    const searchTerm = businessQuery.toLowerCase();

    // Check if the search term is in the title, or vice-versa
    const isDirectMatch = foundName.includes(searchTerm) || searchTerm.includes(foundName);
    
    // Check if at least one word (longer than 3 chars) matches
    // This handles "Safaricom Shop" vs "Safaricom"
    const queryWords = searchTerm.split(/\s+/);
    const hasWordMatch = queryWords.some(word => word.length > 3 && foundName.includes(word));

    if (!isDirectMatch && !hasWordMatch) {
      return NextResponse.json({
        score: 0,
        rank: "Invalid",
        businessName: "Unknown Entity",
        status: "⚠️ Match Failed: The search term does not match any verified local business.",
        recs: ["Double-check your spelling or try adding the specific street name."]
      });
    }

    // --- DYNAMIC SCORING (Only for Valid Matches) ---
    let score = 15; // Starting base for a verified name match
    let recs = [];

    // Map Presence (25 points)
    if (topResult.address) {
      score += 25;
      recs.push("✅ Local Legend: Visible on Google Maps.");
    }

    // Brand Authority (35 points)
    // Check for high review count or website presence
    const reviewCount = topResult.ratingCount || 0;
    if (reviewCount > 20 || topResult.website) {
      score += 35;
      recs.push("✅ Brand Authority: Established entity.");
    } else {
      recs.push("❌ Missing Knowledge Panel: No verified Google Brand identity detected.");
    }

    // SEO Reach (24 points)
    if (topResult.website) {
      score += 24;
      recs.push("✅ Search Reach: Active online presence.");
    } else {
      recs.push("❌ SEO Gap: No professional website detected.");
    }

    return new NextResponse(JSON.stringify({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in ${locationInput}`,
      businessName: topResult.title,
      trust: topResult.rating ? `${topResult.rating} ⭐ (${reviewCount})` : "Verified",
      address: topResult.address || "Nairobi, Kenya",
      phoneNumber: topResult.phoneNumber || null,
      website: topResult.website || null,
      recs,
      status: "Verified digital identity found."
    }), {
      headers: { 'Cache-Control': 'no-store' }
    });

  } catch (error) {
    console.error("Audit Error:", error);
    return NextResponse.json({ score: 0, error: "Service temporarily unavailable" }, { status: 500 });
  }
}