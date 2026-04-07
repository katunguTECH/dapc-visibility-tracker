// src/app/api/save-leads/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email } = body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        clerkId: body.clerkId || "unknown",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}