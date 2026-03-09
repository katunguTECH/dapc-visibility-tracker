import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { business, location } = body;

    if (!business || !location) {
      return NextResponse.json(
        { error: "Business and location required" },
        { status: 400 }
      );
    }

    // Mock competitors (replace with real API later)
    const competitors = [
      {
        name: "Top Ranked Competitor",
        rating: 4.8,
        reviews: 342,
        visibility: 92,
      },
      {
        name: "Local Market Leader",
        rating: 4.6,
        reviews: 210,
        visibility: 85,
      },
      {
        name: "Growing Competitor",
        rating: 4.4,
        reviews: 98,
        visibility: 71,
      },
    ];

    return NextResponse.json({
      success: true,
      business,
      location,
      competitors,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze competitors" },
      { status: 500 }
    );
  }
}