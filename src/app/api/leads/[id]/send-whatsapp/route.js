// src/app/api/leads/[id]/send-whatsapp/route.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { sendWhatsAppMessage, formatWhatsAppMessage } from '@/lib/whatsapp';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    // Get the lead ID from the URL parameters
    const { id } = await params;

    // Find the lead in the database
    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Check if the lead has a phone number
    if (!lead.phone) {
      return NextResponse.json(
        { error: 'This lead does not have a phone number on file' },
        { status: 400 }
      );
    }

    // Format the personalized message
    const message = formatWhatsAppMessage(lead);

    // Send the WhatsApp message
    const result = await sendWhatsAppMessage(lead.phone, message);

    // Update the lead status in the database
    await prisma.lead.update({
      where: { id },
      data: {
        status: 'whatsapp_sent',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'WhatsApp message sent successfully!',
      messageId: result.messageId,
      lead: {
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        status: 'whatsapp_sent'
      }
    });

  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to send WhatsApp message',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}