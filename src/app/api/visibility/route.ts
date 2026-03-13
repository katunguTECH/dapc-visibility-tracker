import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    console.log("VISIBILITY API HIT")

    const body = await req.json()
    const { business, location } = body

    if (!business || !location) {
      return NextResponse.json(
        { error: "Missing business or location" },
        { status: 400 }
      )
    }

    const query = `${business} ${location}`

    console.log("Search Query:", query)

    const apiKey = process.env.SERP_API_KEY

    // Check if API key exists
    if (!apiKey) {

      console.log("SERP_API_KEY NOT FOUND")

      return NextResponse.json({
        query,
        visibilityScore: 0,
        rankingPosition: "API KEY MISSING",
        rating: 0
      })

    }

    const url =
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&hl=en&gl=ke&location=Nairobi,Kenya&num=10&api_key=${apiKey}`

    console.log("SERP API URL:", url)

    const response = await fetch(url)

    if (!response.ok) {

      const errorText = await response.text()

      console.log("SERP API ERROR:", errorText)

      return NextResponse.json({
        query,
        visibilityScore: 0,
        rankingPosition: "API ERROR",
        rating: 0
      })

    }

    const data = await response.json()

    const results = data.organic_results || []

    let rankingIndex = -1

    const businessLower = business.toLowerCase()

    results.forEach((result: any, index: number) => {

      const title = (result.title || "").toLowerCase()
      const snippet = (result.snippet || "").toLowerCase()

      if (
        title.includes(businessLower) ||
        snippet.includes(businessLower)
      ) {
        rankingIndex = index
      }

    })

    let visibilityScore = 10

    if (rankingIndex >= 0) {
      visibilityScore = Math.max(100 - rankingIndex * 10, 10)
    }

    let rating = 0

    if (
      data.knowledge_graph &&
      data.knowledge_graph.rating
    ) {
      rating = data.knowledge_graph.rating
    }

    const rankingPosition =
      rankingIndex >= 0 ? `#${rankingIndex + 1}` : "Not Found"

    console.log("Ranking:", rankingPosition)
    console.log("Visibility Score:", visibilityScore)

    return NextResponse.json({
      query,
      visibilityScore,
      rankingPosition,
      rating
    })

  } catch (error) {

    console.log("VISIBILITY API FAILURE:", error)

    return NextResponse.json({
      query: "",
      visibilityScore: 0,
      rankingPosition: "Server Error",
      rating: 0
    })

  }

}
