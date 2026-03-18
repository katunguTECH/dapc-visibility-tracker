import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {

  const body = await request.json()

  const { leads, business, userId } = body

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" })
  }

  const saved = await Promise.all(

    leads.map((lead: any) =>
      prisma.lead.create({
        data: {
          userId,
          business,
          email: lead.email,
          phone: lead.phone,
          whatsapp: lead.whatsapp,
          quality: lead.quality
        }
      })
    )

  )

  return NextResponse.json({ success: true, saved })

}