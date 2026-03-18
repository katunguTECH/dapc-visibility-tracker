import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  const leads = await prisma.lead.findMany({
    where: { userId }
  })

  return NextResponse.json({ leads })

}