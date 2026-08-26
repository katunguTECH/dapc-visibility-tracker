// src/app/leads/page.jsx
import { auth } from '@clerk/nextjs';
import { PrismaClient } from '@prisma/client';
import LeadManager from '@/components/LeadManager';

const prisma = new PrismaClient();

export default async function LeadsPage() {
  const { userId } = auth();
  
  if (!userId) {
    return <div>Please sign in to view leads</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <LeadManager />
    </div>
  );
}