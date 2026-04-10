import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const business = searchParams.get("business") || "Business";

  const score = Math.floor(Math.random() * 60 + 20);
  const seoScore = Math.floor(Math.random() * 70 + 10);

  return NextResponse.json({
    business,
    score,
    seoScore,
    mapsPresence: Math.random() > 0.5,
    social: {
      facebook: Math.random() > 0.5,
      twitter: Math.random() > 0.5,
      instagram: Math.random() > 0.5,
      tiktok: Math.random() > 0.5,
    },
    competitors: [
      { name: `${business} Competitor A`, score: 60 },
      { name: `${business} Competitor B`, score: 55 },
      { name: `${business} Competitor C`, score: 48 },
    ],
  });
}