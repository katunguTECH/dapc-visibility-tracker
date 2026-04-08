import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const business = url.searchParams.get("business") || "Unknown";

  try {
    // SERPAPI Google Search
    const serpRes = await fetch(`https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(business)}&google_domain=google.com&gl=ke&hl=en&api_key=${process.env.SERP_API_KEY}`);
    const serpData = await serpRes.json();

    const mapsPresence = serpData.local_results?.length > 0;
    const seoScore = Math.floor(Math.random() * 50 + 50); // placeholder until real SEO logic

    // Social Media detection (Clearbit or SERPER)
    const social = {
      facebook: !!serpData?.knowledge_graph?.facebook,
      twitter: !!serpData?.knowledge_graph?.twitter,
      instagram: !!serpData?.knowledge_graph?.instagram,
      tiktok: false, // add logic if API supports
    };

    // Competitor comparison (top 3 local results)
    const competitors = serpData.local_results?.slice(0, 3).map((c: any) => ({
      name: c.title,
      score: Math.floor(Math.random() * 40 + 60),
    })) || [];

    const data = {
      business,
      score: Math.floor((seoScore + competitors.reduce((acc, c) => acc + c.score, 0)) / (competitors.length + 1)),
      seoScore,
      mapsPresence,
      social,
      competitors
    };

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch visibility data" }, { status: 500 });
  }
}


