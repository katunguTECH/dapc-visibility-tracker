// src/app/admin/reports/page.tsx
"use client";

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminReportsPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Reports</h1>
        <p className="mt-2">This page is under construction.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-blue-600">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
