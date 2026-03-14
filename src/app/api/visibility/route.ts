// src/app/api/visibility/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { businessName, location } = await req.json();
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;

    if (!apiKey) throw new Error("Missing Google API key");

    // ---------------------------
    // 1️⃣ Google Maps API for ratings, reviews, website
    // ---------------------------
    const mapsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      businessName + " " + location
    )}&key=${apiKey}`;

    const mapsRes = await fetch(mapsUrl);
    const mapsData = await mapsRes.json();
    const place = mapsData.results?.[0] || {};

    const rating = place.rating || 0;
    const reviews = place.user_ratings_total || 0;
    const website = place.website || "";

    // ---------------------------
    // 2️⃣ Fuzzy/partial name matching
    // ---------------------------
    const placeName = (place.name || "").toLowerCase();
    const nameMatch = placeName.includes(businessName.toLowerCase());

    // ---------------------------
    // 3️⃣ Base visibility from Maps rating
    // ---------------------------
    let visibilityScore = 10; // default if no match
    if (nameMatch) {
      if (rating >= 4.5) visibilityScore = 80;
      else if (rating >= 4.0) visibilityScore = 70;
      else if (rating >= 3.5) visibilityScore = 60;
      else if (rating >= 3.0) visibilityScore = 50;
      else visibilityScore = 40;

      // ---------------------------
      // 4️⃣ Social media & website boosts
      // ---------------------------
      const socialSites = ["facebook.com", "instagram.com", "linkedin.com", "twitter.com"];
      const textToCheck = (
        (place.name || "") + " " + (place.formatted_address || "") + " " + website
      ).toLowerCase();

      if (website) visibilityScore += 10;
      socialSites.forEach((site) => {
        if (textToCheck.includes(site)) visibilityScore += 5;
      });

      // Cap at 100%
      visibilityScore = Math.min(visibilityScore, 100);
    }

    // ---------------------------
    // 5️⃣ Ranking approximation
    // ---------------------------
    const ranking =
      !nameMatch
        ? "10+"
        : visibilityScore > 80
        ? "#1"
        : visibilityScore > 60
        ? "#2-3"
        : "#4-5";

    return NextResponse.json({
      visibilityScore,
      ranking,
      rating,
      reviews,
      website,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visibility data" },
      { status: 500 }
    );
  }
}