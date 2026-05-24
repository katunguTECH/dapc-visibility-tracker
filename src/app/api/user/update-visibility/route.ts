// src/app/api/user/update-visibility/route.ts
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { business, score, seoScore, mapsPresence, social } = await req.json();

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Get current metadata or create empty
    const currentMetadata = user.publicMetadata || {};
    const visibilityProfile = {
      business,
      score,
      seoScore,
      mapsPresence,
      social,
      lastUpdated: new Date().toISOString(),
    };

    // Store the latest profile (override previous)
    await client.users.updateUser(userId, {
      publicMetadata: {
        ...currentMetadata,
        visibilityProfile,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}