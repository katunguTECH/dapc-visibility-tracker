import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { business, location } = await req.json();

  const searchResponse = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: `${business} ${location} Kenya`,
      gl: "ke",
      hl: "en",
    }),
  });

  const searchData = await searchResponse.json();

  const mapsResponse = await fetch("https://google.serper.dev/maps", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: business,
      gl: "ke",
    }),
  });

  const mapsData = await mapsResponse.json();

  const organic = searchData.organic || [];

  const rankingPosition = organic.findIndex((r: any) =>
    r.title.toLowerCase().includes(business.toLowerCase())
  );

  const googleRanking =
    rankingPosition === -1 ? 0 : 100 - rankingPosition * 10;

  const competitors = organic.slice(0, 5).map((r: any) => ({
    name: r.title,
    link: r.link,
  }));

  const mapResult = mapsData.places?.[0];

  const rating = mapResult?.rating || 0;
  const reviews = mapResult?.reviews || 0;

  const visibilityScore =
    googleRanking * 0.4 +
    (mapResult ? 100 : 0) * 0.3 +
    Math.min(reviews / 500, 1) * 100 * 0.2 +
    rating * 20 * 0.1;

  return NextResponse.json({
    visibilityScore: Math.round(visibilityScore),
    rating,
    reviews,
    rankingPosition,
    competitors,
  });
}