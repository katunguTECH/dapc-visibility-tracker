// /api/visibility/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const businessRaw =
    url.searchParams.get("query") ||
    url.searchParams.get("business") ||
    url.searchParams.get("name");

  if (!businessRaw || businessRaw.trim().length < 2) {
    return NextResponse.json({ error: "No business name" }, { status: 400 });
  }

  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing SERPER_API_KEY" },
      { status: 500 }
    );
  }

  const business = businessRaw.trim();
  const searchQuery = `${business} Nairobi Kenya`;

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: searchQuery,
        gl: "ke",
        hl: "en",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Serper request failed", status: res.status },
        { status: 500 }
      );
    }

    const data = await res.json();

    const organic = data.organic || [];
    const knowledge = data.knowledgeGraph || {};
    const local = data.places || [];

    // =========================
    // MAPS
    // =========================
    const hasMaps =
      !!knowledge?.title ||
      local.length > 0;

    const mapsScore = hasMaps ? 100 : 0;

    // =========================
    // SOCIAL
    // =========================
    const links = organic.map((r: any) =>
      (r.link || "").toLowerCase()
    );

    const checkSocial = (platform: string) =>
      links.some((l: string) => l.includes(platform));

    const social = {
      facebook: checkSocial("facebook.com"),
      twitter: checkSocial("twitter.com") || checkSocial("x.com"),
      instagram: checkSocial("instagram.com"),
      tiktok: checkSocial("tiktok.com"),
    };

    const activeSocialCount =
      Object.values(social).filter(Boolean).length;

    // =========================
    // SEO
    // =========================
    let seoScore = Math.min((organic.length / 10) * 100, 100);

    if (
      organic[0]?.title?.toLowerCase().includes(business.toLowerCase()) ||
      knowledge?.title
    ) {
      seoScore = Math.max(seoScore, 95);
    }

    // =========================
    // COMPETITORS
    // =========================
    const competitors =
      local.length > 1
        ? local.slice(0, 3).map((item: any) => ({
            name: item.title,
            score: Math.floor(Math.random() * 10 + 85),
          }))
        : [
            { name: "Airtel Kenya", score: 88 },
            { name: "Telkom Kenya", score: 72 },
            { name: "Equitel", score: 65 },
          ];

    // =========================
    // FINAL SCORE
    // =========================
    let finalScore = Math.floor(
      seoScore * 0.4 +
        mapsScore * 0.3 +
        activeSocialCount * 25 * 0.3
    );

    if (knowledge?.title && finalScore < 85) finalScore = 96;
    if (hasMaps && finalScore < 30) finalScore = 45;

    return NextResponse.json({
      business,
      score: finalScore,
      seoScore: Math.floor(seoScore),
      mapsPresence: hasMaps,
      social,
      competitors,
    });

  } catch (error: any) {
    console.error("Serper API Error:", error);
    return NextResponse.json(
      { error: "API Failure", message: error?.message },
      { status: 500 }
    );
  }
}