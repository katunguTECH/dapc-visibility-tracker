import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business } = body;

    // Mock analysis result
    const result = {
      business,
      exposure: Math.floor(Math.random() * 100000),
      leads: Math.floor(Math.random() * 500),
      platforms: [
        { name: "Google", visibility: "High" },
        { name: "Facebook", visibility: "Medium" },
        { name: "Instagram", visibility: "Low" }
      ]
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze business" },
      { status: 500 }
    );
  }
}