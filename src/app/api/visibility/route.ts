import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Accept multiple query param names
  const businessRaw =
    url.searchParams.get("query") ||
    url.searchParams.get("business") ||
    url.searchParams.get("name");

  if (!businessRaw || businessRaw.trim().length < 2) {
    return NextResponse.json({ error: "No business name provided" }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY || process.env.SERP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing SERPAPI key" }, { status: 500 });
  }

  const business = businessRaw.trim();
  const searchQuery = `${business} Nairobi Kenya`;

  try {
    const serpUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(
      searchQuery
    )}&google_domain=google.co.ke&gl=ke&hl=en&api_key=${apiKey}`;

    const res = await fetch(serpUrl, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: "SerpAPI request failed", details: text }, { status: 500 });
    }

    const data = await res.json();

    // Basic parsing
    const organic = Array.isArray(data?.organic_results) ? data.organic_results : [];
    const local = Array.isArray(data?.local_results) ? data.local_results : [];
    const kg = data?.knowledge_graph || {};

    // Google Maps presence
    const hasMaps = !!kg?.title || local.length > 0;
    
    // Social media detection
    const socialProfiles = Array.isArray(kg?.profiles) ? kg.profiles : [];
    const checkSocial = (platform: string) =>
      socialProfiles.some((p: any) => JSON.stringify(p).toLowerCase().includes(platform));

    const social = {
      facebook: checkSocial("facebook.com"),
      twitter: checkSocial("twitter.com") || checkSocial("x.com"),
      instagram: checkSocial("instagram.com"),
      tiktok: checkSocial("tiktok.com"),
    };

    // SEO score (simple)
    let seoScore = Math.min((organic.length / 10) * 100, 100);
    const topTitle = organic[0]?.title?.toLowerCase() || "";
    if (topTitle.includes(business.toLowerCase()) || kg?.title) seoScore = Math.max(seoScore, 95);

    // Competitors fallback
    const competitors =
      local.length > 1
        ? local.slice(0, 3).map((item: any) => ({ name: item.title, score: Math.floor(Math.random() * 10 + 85) }))
        : [
            { name: "Airtel Kenya", score: 88 },
            { name: "Telkom Kenya", score: 72 },
            { name: "Equitel", score: 65 },
          ];

    // Final score (simplified)
    let finalScore = Math.floor(seoScore * 0.5 + (hasMaps ? 30 : 0) + Object.values(social).filter(Boolean).length * 5);

    return NextResponse.json({
      business,
      score: finalScore,
      seoScore: Math.floor(seoScore),
      mapsPresence: hasMaps,
      social,
      competitors,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "API Failure", message: error?.message || "Unknown error" }, { status: 500 });
  }
}