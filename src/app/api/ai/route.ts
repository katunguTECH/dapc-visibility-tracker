import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, userId } = await req.json();

  // Temporary mock response
  // Replace with real OpenAI or DB-aware logic later
  return NextResponse.json({
    text: `DAPC AI Response for user ${userId || "guest"}: You asked "${prompt}"`,
  });
}