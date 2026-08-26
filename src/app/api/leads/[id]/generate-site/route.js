// src/app/api/leads/[id]/generate-site/route.js
import { NextResponse } from 'next/server';
import { AISiteGenerator } from '@/services/aiSiteGenerator';
import { auth } from '@clerk/nextjs';

export async function POST(request, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const generator = new AISiteGenerator();
    
    const result = await generator.generateAndAttachToLead(id);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: `Site generated successfully for ${result.businessName}`
    });

  } catch (error) {
    console.error('Site generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate site',
      details: error.message
    }, { status: 500 });
  }
}