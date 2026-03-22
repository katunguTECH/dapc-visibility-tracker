import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper: Checks if the search term actually matches the result name
function isLegitMatch(query: string, resultName: string): boolean {
  const q = query.toLowerCase().trim();
  const r = resultName.toLowerCase().trim();
  
  // 1. Direct Inclusion
  if (r.includes(q) || q.includes(r)) return true;
  
  // 2. Word Overlap (At least one significant word must match)
  const qWords = q.split(/\s+/).filter(w => w.length > 3);
  const rWords = r.split(/\s+/);
  return qWords.some(word => rWords.includes(word));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery || businessQuery.length < 3) {
    return NextResponse.json({ score: 0, status: "Invalid Input" });
  }

  try {
    const response = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke", hl: "en" })
    });

    const data = await response.json();
    const topResult = data.places?.[0];

    // --- CRITICAL VALIDATION ---
    if (!topResult || !isLegitMatch(businessQuery, topResult.title)) {
      return NextResponse.json({
        score: 0,
        rank: "Not Found",
        trust: "Unverified",
        businessName: "Unknown Entity",
        recs: ["❌ No matching business found for this query."],
        status: "Match Failed"
      });
    }

    // --- SCORING (Only for real matches) ---
    let score = 20; // Base for matching name
    let recs = [];

    if (topResult.address && !topResult.address.includes("Kenya") || topResult.address.length > 10) {
      score += 25;
      recs.push("✅ Local Legend: Verified physical location.");
    }

    if (topResult.phoneNumber) {
      score += 25;
      recs.push("✅ Contact Ready: Direct line identified.");
    }

    if (topResult.website) {
      score += 29;
      recs.push("✅ Search Reach: Professional site detected.");
    }

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in ${locationInput}`,
      businessName: topResult.title,
      trust: topResult.rating ? `${topResult.rating} ⭐ (${topResult.ratingCount || 0})` : "Verified",
      recs,
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "Error" });
  }
}