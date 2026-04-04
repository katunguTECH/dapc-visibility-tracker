// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simulated competitor pool
const competitorsPool = [
  { name: "Competitor A", baseScore: 70 },
  { name: "Competitor B", baseScore: 65 },
  { name: "Competitor C", baseScore: 60 },
  { name: "Competitor D", baseScore: 55 },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest) {
  try {
    const { businessName } = await req.json();

    if (!businessName) {
      return NextResponse.json({ error: "Business name required" }, { status: 400 });
    }

    let score: number;
    let website: number;
    let search: number;
    let maps: number;
    let social: number;
    let seo: number;
    let gaps: string[] = [];

    const lowerName = businessName.toLowerCase();

    if (lowerName.includes("safaricom")) {
      score = 94;
      website = 20;
      search = 20;
      maps = 18;
      social = 18;
      seo = 18;
    } else if (lowerName.length > 3) {
      // Small/medium business simulation
      score = randomInt(10, 40);
      website = Math.min(20, Math.floor(score / 5));
      search = Math.min(20, Math.floor(score / 5));
      maps = Math.min(20, Math.floor(score / 6));
      social = Math.min(20, Math.floor(score / 6));
      seo = Math.min(20, Math.floor(score / 6));
      gaps = [
        "Weak Google Maps presence",
        "Low search visibility",
        "Weak social media presence",
        "Poor SEO optimization",
      ];
    } else {
      // Very small / unknown business
      score = randomInt(5, 20);
      website = randomInt(2, 8);
      search = randomInt(2, 8);
      maps = randomInt(1, 5);
      social = randomInt(1, 5);
      seo = randomInt(1, 5);
      gaps = [
        "No Google Maps listing",
        "Minimal search presence",
        "No social media presence",
        "SEO not optimized",
      ];
    }

    // Pick 2 random competitors
    const competitors = competitorsPool.sort(() => 0.5 - Math.random()).slice(0, 2);

    return NextResponse.json({
      name: businessName,
      location: "Nairobi",
      score,
      website,
      search,
      maps,
      social,
      seo,
      gaps,
      competitors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}