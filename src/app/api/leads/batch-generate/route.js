import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AISiteGenerator } from '@/services/aiSiteGenerator.cjs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { leadIds } = await request.json();
        
        if (!leadIds || !Array.isArray(leadIds)) {
            return NextResponse.json({
                error: 'Please provide an array of lead IDs'
            }, { status: 400 });
        }

        const generator = new AISiteGenerator();
        const results = [];
        
        for (const leadId of leadIds) {
            try {
                const result = await generator.generateAndAttachToLead(leadId);
                results.push({
                    leadId,
                    success: true,
                    businessName: result.businessName,
                    siteUrl: result.siteUrl
                });
            } catch (error) {
                results.push({
                    leadId,
                    success: false,
                    error: error.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            total: results.length,
            succeeded: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        });
    } catch (error) {
        console.error('Batch generation error:', error);
        return NextResponse.json({
            error: 'Batch generation failed',
            details: error.message
        }, { status: 500 });
    }
}
