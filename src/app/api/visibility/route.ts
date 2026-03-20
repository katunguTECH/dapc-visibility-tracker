import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // 1. Extract params from the URL (Correct for GET)
    const { searchParams } = new URL(req.url);
    const business = searchParams.get("business");
    const location = searchParams.get("location");

    if (!business) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_SEARCH_API_KEY;

    if (!apiKey) {
      console.error("Missing Google API Key");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 2. Mock Data for Testing (Use this to confirm the UI works first)
    // Once the UI shows these results, you can swap back to your Google Fetch logic
    const mockResult = {
      visibilityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      ranking: "2nd Page",
      rating: 4.5,
      reviews: 28,
      status: "success"
    };

    return NextResponse.json(mockResult);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}