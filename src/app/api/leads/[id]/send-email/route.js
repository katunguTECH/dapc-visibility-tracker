import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const isKenyan = body.isKenyan !== false;

    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!lead.email) {
      return NextResponse.json({ error: 'No email address saved for this lead' }, { status: 400 });
    }

    if (lead.status !== 'site_generated') {
      return NextResponse.json({ error: 'Generate a site for this lead first' }, { status: 400 });
    }

    const siteUrl = `https://dapc.co.ke/sites/${id}`;
    const price = isKenyan ? 'KES 2,999' : '$19.99';

    const subject = `We built a free website preview for ${lead.name}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
        <h1 style="color: #1a1a2e;">Hi ${lead.name},</h1>
        <p>We noticed your business doesn't have a website yet, so we built a free preview to show you what's possible.</p>
        <p>
          <a href="${siteUrl}" style="display:inline-block;background:#e8650a;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
            View Your Free Preview
          </a>
        </p>
        <p>Like what you see? We can get you a fully live, custom website starting at just <strong>${price}</strong>.</p>
        <p>Reply to this email or reach us on WhatsApp to get started.</p>
        <p>Best,<br/>DAPC Visibility Tracker</p>
      </div>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: lead.email,
      bcc: 'katungu1@gmail.com',
      subject,
      html,
    });

    await prisma.lead.update({
      where: { id },
      data: { status: 'email_sent' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send email error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
