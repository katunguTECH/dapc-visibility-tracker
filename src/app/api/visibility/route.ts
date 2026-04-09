import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  // =========================
  // 1. INPUT
  // =========================
  const businessRaw =
    url.searchParams.get("query") ||
    url.searchParams.get("business") ||
    url.searchParams.get("name");

  if (!businessRaw || businessRaw.trim().length < 2) {
    return NextResponse.json(
      { error: "No business name" },
      { status: 400 }
    );
  }

  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    console.error("[Visibility API] Missing SERPER_API_KEY");
    return NextResponse.json(
      { error: "Missing SERPER_API_KEY" },
      { status: 500 }
    );
  }

  const business = businessRaw.trim();
  const businessLower = business.toLowerCase();
  const searchQuery = `${business} Nairobi Kenya`;

  console.log("[Visibility API] Query:", searchQuery);

  try {
    // =========================
    // 2. FETCH SERPER
    // =========================
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

    const data = await res.json();

    if (!res.ok) {
      console.error("Serper error:", data);
      return NextResponse.json(
        { error: "Serper failed", status: res.status, body: data },
        { status: 500 }
      );
    }

    // =========================
    // 3. SAFE EXTRACTION
    // =========================
    const organic = Array.isArray(data?.organic) ? data.organic : [];
    const local = Array.isArray(data?.localResults) ? data.localResults : [];
    const places = Array.isArray(data?.places) ? data.places : [];
    const kg = data?.knowledgeGraph || {};
    const placeInfo = data?.placeResults || data?.placeInfo;

    // =========================
    // 4. MAPS
    // =========================
    const hasMaps =
      !!kg?.title ||
      local.length > 0 ||
      places.length > 0 ||
      !!placeInfo;

    const mapsScore = hasMaps ? 100 : 0;

    // =========================
    // 5. SOCIAL
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
    // 6. SEO
    // =========================
    let seoScore = Math.min((organic.length / 10) * 100, 100);

    const topResultTitle =
      organic[0]?.title?.toLowerCase() || "";

    if (topResultTitle.includes(businessLower) || kg?.title) {
      seoScore = Math.max(seoScore, 95);
    }

    // =========================
    // 7. COMPETITORS (FIXED)
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
        businessLower.includes("clinic") ||
        businessLower.includes("medical")
      ) {
        competitors = [
          { name: "Nairobi West Hospital", score: 87 },
          { name: "Karen Hospital", score: 91 },
          { name: "Aga Khan University Hospital", score: 95 },
        ];
      } else if (
        businessLower.includes("hotel") ||
        businessLower.includes("resort")
      ) {
        competitors = [
          { name: "Villa Rosa Kempinski", score: 95 },
          { name: "Sarova Stanley", score: 90 },
          { name: "Radisson Blu Nairobi", score: 92 },
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
    // 8. FINAL SCORE
    // =========================
    let finalScore = Math.floor(
      seoScore * 0.4 +
        mapsScore * 0.3 +
        activeSocialCount * 25 * 0.3
    );

    if (kg?.title && finalScore < 85) finalScore = 96;
    if (hasMaps && finalScore < 30) finalScore = 45;

    // =========================
    // 9. RESPONSE
    // =========================
    return NextResponse.json({
      business,
      score: finalScore,
      seoScore: Math.floor(seoScore),
      mapsPresence: hasMaps,
      social,
      competitors,
    });
  } catch (error: any) {
    console.error("[Visibility API ERROR]:", error);

    return NextResponse.json(
      {
        error: "API Failure",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}