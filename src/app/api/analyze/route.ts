import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { business } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Analyze this business for its digital footprint and lead potential: ${business}`,
      },
    ],
  });

  const output = response.choices[0].message.content;

  return NextResponse.json({ output });
}