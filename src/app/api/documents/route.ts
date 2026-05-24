import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma'; // Your Prisma client instance
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, fileUrl, fileType, fileSize } = body;

  // Optionally, get user details to store ownerName
  // ...

  const document = await prisma.document.create({
    data: {
      title,
      fileUrl,
      fileType,
      fileSize,
      ownerId: userId,
      ownerName: 'User Name', // Fetch from Clerk
    },
  });

  return NextResponse.json(document);
}