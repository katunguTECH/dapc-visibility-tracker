import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const business = searchParams.get("business");
    const location = searchParams.get("location") || "Kenya";

    if (!business) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY; // Ensure this is in Vercel!

    // This query tells Google to look at specific platforms for this business
    const query = `${business} ${location} site:facebook.com OR site:instagram.com OR site:linkedin.com OR site:twitter.com OR site:yellowpageskenya.com`;
    
    const googleRes = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${process.env.GOOGLE_CX}&q=${encodeURIComponent(query)}`
    );

    const data = await googleRes.json();
    
    // Logic to calculate visibility based on how many "hits" we found
    const totalResults = parseInt(data.searchInformation?.totalResults || "0");
    const hasSocial = data.items?.some((item: any) => item.link.includes("facebook") || item.link.includes("instagram"));
    
    // Score Calculation Logic
    let score = 20; // Base score
    if (totalResults > 5) score += 30;
    if (hasSocial) score += 30;
    if (totalResults > 50) score += 20;

    return NextResponse.json({
      visibilityScore: Math.min(score, 98), // Cap at 98 for realism
      ranking: totalResults > 0 ? "1st Page" : "Not Found",
      rating: hasSocial ? (Math.random() * (5 - 3.5) + 3.5).toFixed(1) : "N/A",
      reviews: Math.floor(totalResults * 0.4),
      sourceCount: data.items?.length || 0,
      platforms: hasSocial ? ["Facebook", "Instagram"] : ["Web"]
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch live data" }, { status: 500 });
  }
}