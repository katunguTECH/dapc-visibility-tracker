import { NextResponse } from "next/server";

// Example: replace with real Google Business / Analytics API calls later
export async function GET() {
  const data = {
    local: {
      searches: 1248,
      impressions: 932,
      directionRequests: 120,
      callsFromGoogle: 46,
    },
    global: {
      visitors: [
        { country: "UK", count: 120 },
        { country: "USA", count: 98 },
        { country: "UAE", count: 45 },
      ],
      impressions: 3210,
    },
  };

  return NextResponse.json(data);
}