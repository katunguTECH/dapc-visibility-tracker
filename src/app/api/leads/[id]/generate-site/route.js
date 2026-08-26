import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { AISiteGenerator } from '@/services/aiSiteGenerator.cjs';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    try {
        const { id } = await params;
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
            error: error.message || 'Failed to generate site'
        }, { status: 500 });
    }
}