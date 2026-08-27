import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await req.json();
  const { title, fileUrl, fileType, fileSize } = body;

  const document = await prisma.document.create({
    data: {
      title,
      fileUrl,
      fileType,
      fileSize,
      ownerId: user.id,
    },
  });
  return NextResponse.json(document);
}