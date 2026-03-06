import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { business } = await req.json();

    if (!business) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }

    // MOCK ANALYSIS
    const mockAnalysis = {
      name: business,
      seoScore: Math.floor(Math.random() * 100),
      googleSearchResults: Math.floor(Math.random() * 1000),
      mapsPresence: Math.random() > 0.5 ? "Listed on Google Maps" : "Not listed",
      estimatedReach: Math.floor(Math.random() * 10000),
      topCompetitors: ["Competitor A", "Competitor B", "Competitor C"],
    };

    return NextResponse.json(mockAnalysis);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}