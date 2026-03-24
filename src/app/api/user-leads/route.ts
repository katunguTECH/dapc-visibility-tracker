import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ✅ FIXED IMPORT

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await prisma.lead.create({
      data: {
        business: body.business,
        location: body.location,
        score: body.score,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("SAVE LEAD ERROR:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}