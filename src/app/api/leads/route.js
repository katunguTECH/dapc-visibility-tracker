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

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, address, phone, placeId } = body;

        if (!name || !address || !placeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await prisma.lead.upsert({
            where: { placeId },
            update: {},
            create: { name, address, phone: phone || null, placeId },
        });

        return NextResponse.json({ success: true, lead });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}