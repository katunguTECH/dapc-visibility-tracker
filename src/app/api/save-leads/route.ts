// src/app/api/save-leads/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone } = body;

  try {
    const lead = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to save lead' });
  }
}