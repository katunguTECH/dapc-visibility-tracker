// src/app/exposure/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // important!

export default async function ExposurePage() {
  const businesses = await prisma.business.findMany();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Businesses</h2>
      {businesses.map((b) => (
        <p key={b.id}>{b.name}</p>
      ))}
    </div>
  );
}