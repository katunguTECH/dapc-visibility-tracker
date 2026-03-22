import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper to check how similar two strings are (0 to 1)
function getStringSimilarity(str1: string, str2: string) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  const commonWords = words1.filter(word => word.length > 2 && words2.includes(word));
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.trim() || "";
  const locationInput = searchParams.get("location")?.trim() || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  if (!businessQuery || businessQuery.length < 3) {
    return NextResponse.json({ score: 0, status: "Please enter a valid business name." });
  }

  try {
    const response = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        q: businessQuery, 
        location: `${locationInput}, Kenya`, 
        gl: "ke" 
      })
    });

    const data = await response.json();
    const topResult = data.places?.[0];

    // --- LOCK 1: EMPTY CHECK ---
    if (!topResult) {
      return NextResponse.json({ score: 0, rank: "N/A", status: "No listings found." });
    }

    // --- LOCK 2: SIMILARITY CHECK ---
    const similarity = getStringSimilarity(businessQuery, topResult.title);
    
    // If similarity is too low (e.g., 'shbbcg' vs 'Nairobi City'), it's a fake match
    if (similarity < 0.3) {
      return NextResponse.json({
        score: 0,
        rank: "Invalid",
        businessName: "Unknown Entity",
        status: "⚠️ Match Failed: No business found matching that name.",
        recs: ["Try a more specific name like 'Java House CBD'."]
      });
    }

    // --- LOCK 3: SCALED SCORING (Strict) ---
    let score = 10; // Base for passing similarity
    let recs = [];

    // Map Presence
    if (topResult.address && !topResult.address.toLowerCase().includes("kenya")) {
        // Only give points if there's a specific street address, not just 'Kenya'
        score += 30;
        recs.push("✅ Local Legend: Specific street address verified.");
    }

    // Contact Data
    if (topResult.phoneNumber) {
      score += 30;
      recs.push("✅ Contact Ready: Phone number listed.");
    }

    // Web Presence
    if (topResult.website) {
      score += 29;
      recs.push("✅ SEO Reach: Professional website found.");
    }

    // Final result
    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in ${locationInput}`,
      businessName: topResult.title,
      trust: topResult.rating ? `${topResult.rating} ⭐ (${topResult.ratingCount || 0})` : "Verified",
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website,
      recs,
      status: "Verified digital identity found."
    });

  } catch (error) {
    return NextResponse.json({ score: 0, error: "Audit Engine Error" });
  }
}