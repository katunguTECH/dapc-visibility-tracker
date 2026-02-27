import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, userId } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Missing message or userId" },
        { status: 400 }
      );
    }

    // Get memberships with business info
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        business: true,
      },
    });

    // Fix for strict TypeScript mode
    const context = memberships.map((m: any) => ({
      name: m.business.name,
      slug: m.business.slug,
      subscriptionStatus: m.business.subscriptionStatus,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI assistant for DAPC Visibility Tracker.

The user belongs to the following businesses:
${JSON.stringify(context, null, 2)}

Answer clearly and professionally.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}