import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🔄 Clearing database...');
    
    // Clear all models in order (respecting foreign keys)
    const cleared = {};
    
    // Delete in order of dependencies (children first)
    // Search references User and Business
    const searchDelete = await prisma.search.deleteMany();
    cleared['Search'] = searchDelete.count;
    console.log(`✅ Cleared ${searchDelete.count} from Search`);
    
    // Document references User
    const documentDelete = await prisma.document.deleteMany();
    cleared['Document'] = documentDelete.count;
    console.log(`✅ Cleared ${documentDelete.count} from Document`);
    
    // Lead is independent
    const leadDelete = await prisma.lead.deleteMany();
    cleared['Lead'] = leadDelete.count;
    console.log(`✅ Cleared ${leadDelete.count} from Lead`);
    
    // Business is referenced by Search
    const businessDelete = await prisma.business.deleteMany();
    cleared['Business'] = businessDelete.count;
    console.log(`✅ Cleared ${businessDelete.count} from Business`);
    
    // Payment is independent
    const paymentDelete = await prisma.payment.deleteMany();
    cleared['Payment'] = paymentDelete.count;
    console.log(`✅ Cleared ${paymentDelete.count} from Payment`);
    
    // User is referenced by Search and Document
    const userDelete = await prisma.user.deleteMany();
    cleared['User'] = userDelete.count;
    console.log(`✅ Cleared ${userDelete.count} from User`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database cleared successfully',
      cleared,
      totalCleared: Object.values(cleared).reduce((a, b) => a + b, 0)
    });
    
  } catch (error) {
    console.error('Error clearing leads:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to clear leads',
    status: 'ok'
  });
}
