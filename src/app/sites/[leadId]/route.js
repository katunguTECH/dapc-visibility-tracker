// src/app/sites/[leadId]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { leadId } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.AI_SITES_BUCKET || 'sites';

  if (!supabaseUrl) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${leadId}.html`;
  return NextResponse.redirect(publicUrl);
}