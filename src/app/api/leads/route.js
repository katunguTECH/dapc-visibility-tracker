import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        return NextResponse.json(leads);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}