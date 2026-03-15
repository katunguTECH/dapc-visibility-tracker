import { NextResponse } from "next/server"

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const business = searchParams.get("business")?.toLowerCase()
  const location = searchParams.get("location")

  if (!business) {
    return NextResponse.json({
      error: "Business name required"
    })
  }

  let visibilityScore = 55
  let competitors = []

  // telecom industry logic
  if (business.includes("safaricom")) {

    visibilityScore = 96

    competitors = [
      { name: "Airtel Kenya", score: 82 },
      { name: "Telkom Kenya", score: 71 }
    ]

  }

  else if (business.includes("airtel")) {

    visibilityScore = 82

    competitors = [
      { name: "Safaricom", score: 96 },
      { name: "Telkom Kenya", score: 71 }
    ]

  }

  else if (business.includes("telkom")) {

    visibilityScore = 71

    competitors = [
      { name: "Safaricom", score: 96 },
      { name: "Airtel Kenya", score: 82 }
    ]

  }

  else {

    // generic Kenyan business estimate

    visibilityScore = Math.floor(Math.random() * 30) + 40

    competitors = [
      { name: "Local Competitor 1", score: visibilityScore + 5 },
      { name: "Local Competitor 2", score: visibilityScore - 5 }
    ]

  }

  return NextResponse.json({

    business,
    location,
    visibilityScore,
    competitors

  })

}