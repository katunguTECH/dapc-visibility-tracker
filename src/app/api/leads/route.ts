import { NextResponse } from "next/server";

let leads: any[] = [];

export async function GET() {
  return NextResponse.json({ leads });
}

export async function POST(req: Request) {

  const body = await req.json();

  const newLead = {
    name: body.name,
    seoScore: body.seoScore,
    reach: body.reach,
    createdAt: new Date()
  };

  leads.push(newLead);

  return NextResponse.json({ success: true });
}