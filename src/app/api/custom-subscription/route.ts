import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, companyName, amount, userId } = body;

    // Here you can:
    // 1. Save to a database (e.g., Prisma, MongoDB)
    // 2. Send an email notification to admin@dapc.co.ke
    // 3. Store in Clerk metadata if userId is provided

    console.log(`New custom subscription: ${companyName} (${email}) - Amount: ${amount || 'TBD'}`);

    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing custom subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}