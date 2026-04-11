import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const business = searchParams.get("business") || "Unknown Business";

    const name = business.trim();

    const score = Math.max(20, Math.min(85, 25 + Math.random() * 55));
    const seoScore = Math.max(20, Math.min(80, 20 + Math.random() * 60));

    const mapsPresence = Math.random() > 0.4;

    const social = {
      facebook: Math.random() > 0.5,
      twitter: Math.random() > 0.5,
      instagram: Math.random() > 0.5,
      tiktok: Math.random() > 0.5,
    };

    const competitors = [
      { name: "Local Competitor A", score: 60 + Math.floor(Math.random() * 20) },
      { name: "Local Competitor B", score: 55 + Math.floor(Math.random() * 25) },
      { name: "Local Competitor C", score: 50 + Math.floor(Math.random() * 30) },
    ];

    return NextResponse.json({
      business: name,
      score,
      seoScore,
      mapsPresence,
      social,
      competitors,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({
      business: "Safe Mode Business",
      score: 0,
      seoScore: 0,
      mapsPresence: false,
      social: {
        facebook: false,
        twitter: false,
        instagram: false,
        tiktok: false,
      },
      competitors: [],
      error: "safe-fallback",
    });
  }
}