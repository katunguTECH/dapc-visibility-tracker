import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import path from 'path';

// Use absolute path from project root
const projectRoot = process.cwd();
const generatorPath = path.join(projectRoot, 'src/services/aiSiteGenerator.cjs');
const { AISiteGenerator } = require(generatorPath);

const prisma = new PrismaClient();

export async function POST(request, { params }) {
    try {
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
            error: error.message || 'Failed to generate site'
        }, { status: 500 });
    }
}