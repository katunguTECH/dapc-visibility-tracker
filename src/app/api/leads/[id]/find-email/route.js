import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getJson } from 'serpapi';

const prisma = new PrismaClient();

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const query = `${lead.name} ${lead.address} email contact`;

    const results = await new Promise((resolve, reject) => {
      getJson(
        {
          engine: 'google',
          q: query,
          api_key: process.env.SERPAPI_KEY,
        },
        (json) => resolve(json)
      );
    });

    const snippets = (results.organic_results || [])
      .map((r) => `${r.title || ''} ${r.snippet || ''}`)
      .join(' ');

    const match = snippets.match(EMAIL_REGEX);

    if (!match) {
      return NextResponse.json({ success: false, message: 'No email found' });
    }

    const email = match[0];

    await prisma.lead.update({
      where: { id },
      data: { email },
    });

    return NextResponse.json({ success: true, email });
  } catch (error) {
    console.error('Find email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to find email' }, { status: 500 });
  }
}