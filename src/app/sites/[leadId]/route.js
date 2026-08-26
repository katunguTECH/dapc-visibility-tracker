// src/app/sites/[leadId]/route.js
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { leadId } = params;
    const sitePath = path.join(process.cwd(), 'public', 'sites', `${leadId}.html`);
    
    try {
      const html = await readFile(sitePath, 'utf-8');
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (error) {
      // Generate on-the-fly if not found
      return NextResponse.json({
        error: 'Site not found. Please generate it first.'
      }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load site' }, { status: 500 });
  }
}