import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = [
  'info@dapc.co.ke',
  'katungu1@gmail.com',
  'n.waswani@dapc.co.ke',
  'h.munyoki@dapc.co.ke',
  'k.ouko@dapc.co.ke'
];

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const adminUser = await client.users.getUser(userId);
  const adminEmail = adminUser.emailAddresses[0]?.emailAddress;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await client.users.getUserList();
  const enrichedUsers = users.map(user => {
    const metadata = user.publicMetadata as any;
    return {
      id: user.id,
      name: user.fullName || user.firstName || 'Unknown',
      email: user.emailAddresses[0]?.emailAddress || 'No email',
      createdAt: user.createdAt,
      subscription: metadata?.subscription || null,
      visibilityProfile: metadata?.visibilityProfile || null,
    };
  });

  return NextResponse.json({ users: enrichedUsers });
}