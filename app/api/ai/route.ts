import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  // Fetch only businesses belonging to this Clerk user
  const memberships = await prisma.businessUser.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    include: {
      business: {
        include: {
          subscriptions: true,
        },
      },
    },
  });

  const context = memberships.map((m) => ({
    name: m.business.name,
    slug: m.business.slug,
    subscriptionStatus:
      m.business.subscriptions[0]?.status ?? "none",
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are DAPC AI Assistant.

You help users understand:
- Their businesses
- Subscription status
- Account insights

User Data:
${JSON.stringify(context, null, 2)}

If they have no businesses, explain that clearly.
Be concise, helpful, and professional.
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
}
