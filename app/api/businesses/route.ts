import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = auth(req);

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const businesses = await prisma.businessUser.findMany({
    where: { userId },
    include: {
      business: {
        include: {
          subscriptions: true,
        },
      },
    },
  });

  return NextResponse.json(
    businesses.map(bu => ({
      id: bu.business.id,
      name: bu.business.name,
      slug: bu.business.slug,
      subscription: bu.business.subscriptions[0] || null,
    }))
  );
}