"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function DashboardPage() {
  const { user } = useUser();
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/businesses")
      .then(res => res.json())
      .then(data => setBusinesses(data));
  }, [user]);

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">Your Businesses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {businesses.map(b => (
          <div key={b.id} className="bg-white shadow rounded p-4">
            <h2 className="font-semibold">{b.name}</h2>
            <p>Slug: {b.slug}</p>
            <p>Subscription: {b.subscription?.status || "None"}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}