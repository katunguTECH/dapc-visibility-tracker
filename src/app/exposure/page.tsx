// src/app/exposure/page.tsx
import React from 'react';
import { prisma } from '@/lib/prisma';

const ExposurePage = async () => {
  const businesses = await prisma.business.findMany();

  return (
    <div>
      <h1>Exposure Dashboard</h1>
      <ul>
        {businesses.map((b) => (
          <li key={b.id}>{b.name} - {b.visibilityScore}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExposurePage;