import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// THE BOUNCER: Ensures the result actually belongs to the user's query
function checkReliability(query: string, resultName: string): boolean {
  const q = query.toLowerCase().trim();
  const r = resultName.toLowerCase().trim();
  
  // 1. Direct match check
  if (r.includes(q) || q.includes(r)) return true;

  // 2. Token overlap check (Split by spaces)
  const queryTokens = q.split(/\s+/).filter(t => t.length > 2);
  const resultTokens = r.split(/\s+/);
  
  // If any word from the query (longer than 2 chars) is in the result name, it's likely real
  return queryTokens.some(token => resultTokens.includes(token));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const location = searchParams.get("location") || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const res = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke" })
    });

    const data = await res.json();
    const topResult = data.places?.[0];

    // --- THE GIBBERISH KILLER ---
    if (!topResult || !checkReliability(businessQuery, topResult.title)) {
      return NextResponse.json({
        score: 0,
        rank: "N/A",
        businessName: "Unknown Entity",
        status: "Match Failed: No legitimate business found for this query.",
        recs: ["Please check your spelling or use the official business name."]
      });
    }

    // --- DYNAMIC SCORING (Only runs if reliability check passes) ---
    let score = 15; // Starting base
    if (topResult.address && topResult.address.length > 10) score += 25;
    if (topResult.phoneNumber) score += 25;
    if (topResult.website) score += 25;
    if (topResult.ratingCount > 0) score += 9;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in ${location}`,
      businessName: topResult.title,
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website,
      status: "Verified digital identity found."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, status: "System Error" });
  }
}