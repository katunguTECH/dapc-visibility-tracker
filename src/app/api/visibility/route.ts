
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const business = searchParams.get("business");

    // 🛡️ SAFETY: always ensure business exists
    const name = business?.trim() || "Unknown Business";

    // 📊 REALISTIC SCORE GENERATION (NO FAKE 100%)
    const score = Math.floor(Math.random() * 55) + 25; // 25–80
    const seoScore = Math.floor(Math.random() * 60) + 20; // 20–80

    // 📍 Maps presence logic (biased, not random chaos)
    const mapsPresence = Math.random() > 0.4;

    // 📱 Social presence simulation
    const social = {
      facebook: Math.random() > 0.5,
      twitter: Math.random() > 0.6,
      instagram: Math.random() > 0.4,
      tiktok: Math.random() > 0.7,
    };

    // 🧠 INDUSTRY-AWARE COMPETITOR SYSTEM (FIXED BUG)
    const industryMap: Record<string, string[]> = {
      hospital: ["Nairobi Hospital", "Aga Khan Hospital", "MP Shah"],
      hotel: ["Sarova Stanley", "Villa Rosa Kempinski", "Panari Hotel"],
      restaurant: ["Java House", "Artcaffe", "KFC Kenya"],
      school: ["Brookhouse", "Strathmore School", "Makini School"],
      default: ["Local Competitor A", "Local Competitor B", "Local Competitor C"],
    };

    const lowerName = name.toLowerCase();

    let competitors: { name: string; score: number }[] = [];

    if (lowerName.includes("hospital")) {
      competitors = industryMap.hospital.map((c) => ({
        name: c,
        score: Math.floor(Math.random() * 30) + 60,
      }));
    } else if (lowerName.includes("hotel")) {
      competitors = industryMap.hotel.map((c) => ({
        name: c,
        score: Math.floor(Math.random() * 30) + 55,
      }));
    } else if (lowerName.includes("restaurant") || lowerName.includes("cafe")) {
      competitors = industryMap.restaurant.map((c) => ({
        name: c,
        score: Math.floor(Math.random() * 30) + 50,
      }));
    } else if (lowerName.includes("school")) {
      competitors = industryMap.school.map((c) => ({
        name: c,
        score: Math.floor(Math.random() * 30) + 60,
      }));
    } else {
      competitors = industryMap.default.map((c) => ({
        name: `${name} vs ${c}`,
        score: Math.floor(Math.random() * 40) + 40,
      }));
    }

    // 📦 FINAL SAFE RESPONSE (NEVER UNDEFINED)
    return NextResponse.json({
      business: name,
      score,
      seoScore,
      mapsPresence,
      social,
      competitors,
    });
  } catch (error: any) {
    console.error("VISIBILITY API ERROR:", error);

    // 🛡️ NEVER BREAK FRONTEND
    return NextResponse.json(
      {
        business: "Error Business",
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
        error: "Internal API error",
      },
      { status: 200 }
    );
  }
}