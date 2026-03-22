import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessQuery = searchParams.get("business")?.toLowerCase().trim() || "";
  const location = searchParams.get("location") || "Nairobi";
  const apiKey = process.env.SERP_API_KEY?.replace(/['"]+/g, '').trim();

  try {
    const response = await fetch(`https://google.serper.dev/places`, {
      method: 'POST',
      headers: { 'X-API-KEY': apiKey || "", 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: businessQuery, gl: "ke", location: `${location}, Kenya` })
    });

    const data = await response.json();
    const places = data.places || [];
    
    if (places.length === 0) {
      return NextResponse.json({ score: 0, rank: "N/A", status: "No business found." });
    }

    const topResult = places[0];
    const foundName = topResult.title.toLowerCase();

    // --- THE GIBBERISH KILLER ---
    // Check if the user's search string actually appears in the result title.
    // If I search 'qwert' and Google gives me 'Quality Hotel', this will be false.
    const isDirectMatch = foundName.includes(businessQuery) || businessQuery.includes(foundName);
    
    // We also check for "Word Match" - at least one full word must match
    const queryWords = businessQuery.split(" ");
    const hasWordMatch = queryWords.some(word => word.length > 3 && foundName.includes(word));

    if (!isDirectMatch && !hasWordMatch) {
      return NextResponse.json({ 
        score: 0, 
        rank: "Invalid", 
        businessName: "Not Found",
        status: "We couldn't verify this business name. Please check your spelling.",
        leads: [] 
      });
    }

    // --- SCALED SCORING FOR REAL BUSINESSES ---
    let score = 20; // Starting base for a verified name match
    if (topResult.address) score += 15;
    if (topResult.phoneNumber) score += 20;
    if (topResult.website) score += 20;
    
    // Review Scaling: Only give points if they actually have reviews
    const reviewCount = topResult.ratingCount || 0;
    if (reviewCount > 100) score += 25;
    else if (reviewCount > 10) score += 15;
    else if (reviewCount > 0) score += 5;

    return NextResponse.json({
      score: Math.min(score, 99),
      rank: `#${topResult.position || 1} in ${location}`,
      businessName: topResult.title,
      status: "Verified digital identity found.",
      address: topResult.address,
      phoneNumber: topResult.phoneNumber,
      website: topResult.website
    });

  } catch (error) {
    return NextResponse.json({ score: 0, error: "System Busy" });
  }
}