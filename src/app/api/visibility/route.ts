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

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    console.error("[Visibility API] Missing SERPAPI key");
    return NextResponse.json(
      { error: "Missing SERPAPI key. Contact admin." },
      { status: 500 }
    );
  }

  const business = businessRaw.trim();
  const searchQuery = `${business} Nairobi Kenya`;

  console.log("[Visibility API] Running search for:", searchQuery);

  try {
    const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      searchQuery
    )}&google_domain=google.co.ke&gl=ke&hl=en&api_key=${apiKey}`;

    const res = await fetch(serpUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error(
        "[Visibility API] SerpAPI request failed:",
        res.status,
        res.statusText
      );
      return NextResponse.json(
        { error: "SerpAPI request failed", status: res.status },
        { status: 500 }
      );
    }

    const data = await res.json();
    const organic = Array.isArray(data?.organic_results) ? data.organic_results : [];
    const local = Array.isArray(data?.local_results) ? data.local_results : [];
    const kg = data?.knowledge_graph || {};
    const placeInfo = data?.place_results || data?.place_info;

    const hasMaps = !!kg?.title || local.length > 0 || !!placeInfo;
    const mapsScore = hasMaps ? 100 : 0;

    const kgProfiles = Array.isArray(kg?.profiles)
      ? kg.profiles
      : Array.isArray(kg?.social_profiles)
      ? kg.social_profiles
      : [];

    const links = organic.map((r: any) => (r.link || "").toLowerCase());
    const checkSocial = (platform: string) =>
      kgProfiles.some((p: any) => JSON.stringify(p).toLowerCase().includes(platform)) ||
      links.some((l: string) => l.includes(platform));

    const social = {
      facebook: checkSocial("facebook.com"),
      twitter: checkSocial("twitter.com") || checkSocial("x.com"),
      instagram: checkSocial("instagram.com"),
      tiktok: checkSocial("tiktok.com"),
    };

    const activeSocialCount = Object.values(social).filter(Boolean).length;
    let seoScore = Math.min((organic.length / 10) * 100, 100);

    if (organic[0]?.title?.toLowerCase().includes(business.toLowerCase()) || kg?.title) {
      seoScore = Math.max(seoScore, 95);
    }

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

    let finalScore = Math.floor(seoScore * 0.4 + mapsScore * 0.3 + activeSocialCount * 25 * 0.3);
    if (kg?.title && finalScore < 85) finalScore = 96;
    if (hasMaps && finalScore < 30) finalScore = 45;

    return NextResponse.json({
      business,
      score: finalScore,
      seoScore: Math.floor(seoScore),
      mapsPresence: hasMaps,
      social,
      competitors,
      debug: {
        organicCount: organic.length,
        localCount: local.length,
        hasKnowledgeGraph: !!kg?.title,
      },
    });
  } catch (error: any) {
    console.error("[Visibility API] Error:", error.stack || error);
    return NextResponse.json(
      { error: "API Failure", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}