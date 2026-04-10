import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const businessRaw =
    url.searchParams.get("query") ||
    url.searchParams.get("business") ||
    url.searchParams.get("name");

  if (!businessRaw) {
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
  const businessLower = business.toLowerCase();

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: `${business} Nairobi Kenya`,
        gl: "ke",
        hl: "en",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Serper failed", body: data },
        { status: 500 }
      );
    }

    const organic = data?.organic || [];
    const local = data?.localResults || [];
    const kg = data?.knowledgeGraph || {};

    // =========================
    // MAPS
    // =========================
    const mapsPresence = local.length > 0 || !!kg?.title;

    // =========================
    // SOCIAL (IMPROVED)
    // =========================
    const extractLinks = (items: any[]) =>
      items.map((r) => (r.link || "").toLowerCase());

    const organicLinks = extractLinks(organic);

    const kgLinks = Object.values(kg || {})
      .filter((v: any) => typeof v === "string")
      .map((v: string) => v.toLowerCase());

    const allLinks = [...organicLinks, ...kgLinks];

    const checkSocial = (platform: string) =>
      allLinks.some((l: string) => l.includes(platform));

    const social = {
      facebook: checkSocial("facebook.com"),
      twitter: checkSocial("twitter.com") || checkSocial("x.com"),
      instagram: checkSocial("instagram.com"),
      tiktok: checkSocial("tiktok.com"),
    };

    const activeSocialCount =
      Object.values(social).filter(Boolean).length;

    // =========================
    // SEO (FIXED)
    // =========================
    let seoScore = Math.min((organic.length / 10) * 100, 100);

    const hasWebsite = organic.some((r: any) =>
      r.link?.toLowerCase().includes(
        businessLower.replace(/\s+/g, "")
      )
    );

    if (hasWebsite) seoScore += 10;

    seoScore = Math.min(seoScore, 100);
    seoScore = Math.floor(seoScore);

    // =========================
    // COMPETITORS
    // =========================
    let competitors: any[] = [];

    if (local.length > 1) {
      competitors = local.slice(0, 3).map((item: any) => ({
        name: item.title,
        score: Math.floor(Math.random() * 10 + 85),
      }));
    } else {
      if (
        businessLower.includes("hospital") ||
        businessLower.includes("clinic")
      ) {
        competitors = [
          { name: "Nairobi West Hospital", score: 87 },
          { name: "Karen Hospital", score: 91 },
          { name: "Aga Khan University Hospital", score: 95 },
        ];
      } else {
        competitors = [
          { name: "Top Competitor A", score: 85 },
          { name: "Top Competitor B", score: 80 },
          { name: "Top Competitor C", score: 78 },
        ];
      }
    }

    // =========================
    // FINAL SCORE
    // =========================
    const score = Math.floor(
      seoScore * 0.4 +
        (mapsPresence ? 100 : 0) * 0.3 +
        activeSocialCount * 25 * 0.3
    );

    return NextResponse.json({
      business,
      score,
      seoScore,
      mapsPresence,
      social,
      competitors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "API failure", message: error.message },
      { status: 500 }
    );
  }
}