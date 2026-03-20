// src/app/api/visibility/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) { // Change POST to GET
  try {
    // Extract parameters from the URL
    const { searchParams } = new URL(req.url);
    const businessName = searchParams.get("business");
    const location = searchParams.get("location");

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;

    if (!businessName || !apiKey) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ... (keep the rest of your logic exactly the same) ...
    // Note: Use businessName and location in your mapsUrl below
    
    const mapsUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      businessName + " " + (location || "")
    )}&key=${apiKey}`;

    const mapsRes = await fetch(mapsUrl);
    const mapsData = await mapsRes.json();
    const place = mapsData.results?.[0] || {};

    // ... (rest of the calculation logic) ...

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