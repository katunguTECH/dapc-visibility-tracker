import { NextResponse } from "next/server"

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const business = searchParams.get("business")
  const location = searchParams.get("location")

  const leads = [

    {
      name: "Marketing Manager",
      email: "marketing@" + business + ".co.ke",
      phone: "+254712345678",
      whatsapp: "https://wa.me/254712345678"
    },

    {
      name: "Digital Manager",
      email: "digital@" + business + ".co.ke",
      phone: "+254722456789",
      whatsapp: "https://wa.me/254722456789"
    },

    {
      name: "Business Development",
      email: "bd@" + business + ".co.ke",
      phone: "+254733567890",
      whatsapp: "https://wa.me/254733567890"
    }

  ]

  return NextResponse.json({
    business,
    location,
    leads
  })

}