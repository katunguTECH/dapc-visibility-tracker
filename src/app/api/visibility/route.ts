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

  const apiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
  if (!apiKey) {
    console.error("Missing SERPAPI key in environment");
    return NextResponse.json(
      { error: "Missing SERPAPI key" },
      { status: 500 }
    );
  }

  const business = businessRaw.trim();
  const searchQuery = `${business} Nairobi Kenya`;
  console.log("Using SERPAPI key:", apiKey);
  console.log("Search query:", searchQuery);

  try {
    const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      searchQuery
    )}&google_domain=google.co.ke&gl=ke&hl=en&api_key=${apiKey}`;

    const res = await fetch(serpUrl, { cache: "no-store" });
    if (!res.ok) {
      console.error("SerpAPI request failed with status:", res.status);
      return NextResponse.json(
        { error: "SerpAPI request failed", status: res.status },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("SERP RAW (first 1000 chars):", JSON.stringify(data).slice(0, 1000));

    // --- SAFE EXTRACTION ---
    const organic = Array.isArray(data?.organic_results) ? data.organic_results : [];
    const local = Array.isArray(data?.local_results) ? data.local_results : [];
    const kg = data?.knowledge_graph || {};
    const placeInfo = data?.place_results || data?.place_info || {};

    // --- GOOGLE MAPS PRESENCE ---
    const hasMaps = !!kg?.title || local.length > 0 || !!placeInfo;
    const mapsScore = hasMaps ? 100 : 0;

    // --- SOCIAL MEDIA DETECTION ---
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

    // --- SEO SCORE ---
    let seoScore = Math.min((organic.length / 10) * 100, 100);
    const topResultTitle = organic[0]?.title?.toLowerCase() || "";
    const businessLower = business.toLowerCase();
    if (topResultTitle.includes(businessLower) || kg?.title) {
      seoScore = Math.max(seoScore, 95);
    }

    // --- COMPETITORS ---
    let competitors: any[] = [];
    if (local.length > 1) {
      competitors = local.slice(0, 3).map((item: any) => ({
        name: item?.title || "Unknown",
        score: Math.floor(Math.random() * 10 + 85),
      }));
    } else {
      competitors = [
        { name: "Airtel Kenya", score: 88 },
        { name: "Telkom Kenya", score: 72 },
        { name: "Equitel", score: 65 },
      ];
    }

    // --- FINAL SCORE ---
    let finalScore = Math.floor(
      seoScore * 0.4 + mapsScore * 0.3 + activeSocialCount * 25 * 0.3
    );

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
    console.error("API Error:", error.stack || error);
    return NextResponse.json(
      { error: "API Failure", message: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}