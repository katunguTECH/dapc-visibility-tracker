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

    console.log("Search query:", query)

    const apiKey = process.env.SERP_API_KEY

    if (!apiKey) {
      console.log("SERP_API_KEY missing")

      return NextResponse.json({
        query,
        visibilityScore: 0,
        rankingPosition: "API KEY MISSING",
        rating: 0
      })
    }

    const url =
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&hl=en&gl=ke&location=Nairobi,Kenya&num=10&api_key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      const text = await response.text()

      console.log("SERP API ERROR:", text)

      return NextResponse.json({
        query,
        visibilityScore: 0,
        rankingPosition: "API ERROR",
        rating: 0
      })
    }

    const data = await response.json()

    console.log("SERP RESULTS RECEIVED")

    const results = data.organic_results || []

    let rankingPosition = -1

    results.forEach((result: any, index: number) => {

      const title = (result.title || "").toLowerCase()
      const snippet = (result.snippet || "").toLowerCase()
      const businessLower = business.toLowerCase()

      if (
        title.includes(businessLower) ||
        snippet.includes(businessLower)
      ) {
        rankingPosition = index
      }

    })

    let visibilityScore = 10

    if (rankingPosition >= 0) {
      visibilityScore = Math.max(100 - rankingPosition * 10, 10)
    }

    let rating = 0

    if (data.knowledge_graph && data.knowledge_graph.rating) {
      rating = data.knowledge_graph.rating
    }

    const formattedRank =
      rankingPosition >= 0 ? `#${rankingPosition + 1}` : "Not Found"

    return NextResponse.json({
      query,
      visibilityScore,
      rankingPosition: formattedRank,
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
