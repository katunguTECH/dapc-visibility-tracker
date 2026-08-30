// src/app/sites/[leadId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { leadId } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.AI_SITES_BUCKET || 'sites';

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  const fileUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${leadId}.html`;

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Site not found. Please generate it first.' }, { status: 404 });
    }
    const html = await res.text();

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load site' }, { status: 500 });
  }
}