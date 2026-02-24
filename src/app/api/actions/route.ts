import { NextResponse } from "next/server";

// Example: replace with real database/API later
export async function GET() {
  const data = {
    tasks: [
      { task: "Optimizing Google Business Profile", status: "In Progress" },
      { task: "Improving website keywords", status: "Ongoing" },
      { task: "Building local listings", status: "Completed" },
      { task: "Managing reviews & reputation", status: "In Progress" },
      { task: "Structuring content for AI search (GEO)", status: "Ongoing" },
    ],
    recommendations: [
      "Add 5 new photos to your Google profile",
      "Ask 3 customers for reviews",
      "Post one update about your services",
    ],
  };

  return NextResponse.json(data);
}