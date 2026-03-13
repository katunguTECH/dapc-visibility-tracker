import { NextRequest, NextResponse } from "next/server"

const SERP_API_KEY = process.env.SERP_API_KEY

export async function POST(req: NextRequest) {
  try {
    if (!SERP_API_KEY) {
      return NextResponse.json(
        {
          query: "",
          visibilityScore: 0,
          rankingPosition: "#API KEY MISSING",
          rating: 0,
        },
        { status: 200 }
      )
    }

    const { business, location } = await req.json()

    if (!business || !location) {
      return NextResponse.json(
        { error: "Business and location required" },
        { status: 400 }
      )
    }

    const query = `${business} ${location}`

    // Use SerpAPI to get Google search results
    const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&hl=en&gl=ke&location=${encodeURIComponent(
      location + ", Kenya"
    )}&api_key=${SERP_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    // Example: compute visibility score based on organic results & rating
    let visibilityScore = 0
    let rankingPosition = "Not Found"
    let rating = 0

    if (data.organic_results && data.organic_results.length > 0) {
      const firstResult = data.organic_results[0]
      rankingPosition = firstResult.position || 1
      visibilityScore = 100 - (firstResult.position - 1) * 10
      if (visibilityScore < 0) visibilityScore = 0
    }

    if (data.local_results && data.local_results.length > 0) {
      rating = data.local_results[0].rating || 0
    }

    return NextResponse.json({
      query,
      visibilityScore,
      rankingPosition,
      rating,
    })
  } catch (err) {
    console.error("Visibility API error:", err)
    return NextResponse.json(
      {
        query: "",
        visibilityScore: 0,
        rankingPosition: "Error",
        rating: 0,
      },
      { status: 500 }
    )
  }
}
