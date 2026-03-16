import { NextResponse } from "next/server"

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const business = searchParams.get("business")?.toLowerCase() || ""
  const location = searchParams.get("location") || "Kenya"

  if (!business) {
    return NextResponse.json({ error: "Business name required" })
  }

  // Detect industry
  let competitors: any[] = []

  if (business.includes("safaricom") || business.includes("airtel") || business.includes("telkom")) {

    competitors = [
      { name: "Airtel Kenya", score: 78 },
      { name: "Telkom Kenya", score: 69 },
      { name: "Faiba", score: 63 }
    ]

  }

  else if (business.includes("bank") || business.includes("kcb") || business.includes("equity")) {

    competitors = [
      { name: "Equity Bank Kenya", score: 81 },
      { name: "Co-operative Bank", score: 75 },
      { name: "Absa Bank Kenya", score: 73 }
    ]

  }

  else if (business.includes("hospital")) {

    competitors = [
      { name: "Aga Khan Hospital", score: 85 },
      { name: "MP Shah Hospital", score: 77 },
      { name: "Karen Hospital", score: 72 }
    ]

  }

  else {

    competitors = [
      { name: "Local Competitor A", score: 68 },
      { name: "Local Competitor B", score: 64 },
      { name: "Local Competitor C", score: 60 }
    ]

  }

  // Generate realistic score
  const visibilityScore = Math.floor(Math.random() * 30) + 60

  // Example opportunities
  const opportunities = [
    "Improve Google Maps listing optimization",
    "Increase social media engagement",
    "List business in Kenyan directories",
    "Publish SEO optimized content"
  ]

  return NextResponse.json({

    business,
    location,
    visibilityScore,
    googleRank: Math.floor(Math.random() * 5) + 1,
    trustRating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 2000) + 100,

    competitors,
    opportunities

  })

}