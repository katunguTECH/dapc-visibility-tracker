import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const { business, location } = await req.json()

    const query = `${business} ${location}`

    const url =
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&hl=en&gl=ke&location=Nairobi,Kenya&api_key=${process.env.SERP_API_KEY}`

    const response = await fetch(url)

    const data = await response.json()

    const organic = data.organic_results || []
    const local = data.local_results || []

    let rankingPosition = -1

    const businessName = business.toLowerCase()
    const businessKeyword = businessName.split(" ")[0]

    // Detect ranking position
    organic.forEach((result: any, index: number) => {

      const title = (result.title || "").toLowerCase()
      const snippet = (result.snippet || "").toLowerCase()
      const link = (result.link || "").toLowerCase()

      if (
        rankingPosition === -1 &&
        (
          title.includes(businessName) ||
          snippet.includes(businessName) ||
          link.includes(businessName) ||
          title.includes(businessKeyword) ||
          link.includes(businessKeyword)
        )
      ) {
        rankingPosition = index
      }

    })

    // Extract competitors
    const competitors = organic.slice(0, 5).map((result: any) => ({
      name: result.title,
      link: result.link
    }))

    // Extract rating from local results (Google Maps)
    let rating = 0

    if (local.length > 0) {

      const match = local.find((place: any) =>
        (place.title || "").toLowerCase().includes(businessKeyword)
      )

      if (match) {
        rating = match.rating || 0
      }

    }

    // Visibility scoring
    let visibilityScore = 10

    if (rankingPosition === 0) visibilityScore = 100
    else if (rankingPosition >= 1 && rankingPosition <= 2) visibilityScore = 80
    else if (rankingPosition >= 3 && rankingPosition <= 5) visibilityScore = 60
    else if (rankingPosition >= 6 && rankingPosition <= 9) visibilityScore = 40
    else visibilityScore = 10

    return NextResponse.json({
      query,
      visibilityScore,
      rankingPosition: rankingPosition >= 0 ? rankingPosition + 1 : "Not Found",
      rating,
      competitors
    })

  } catch (error) {

    console.error("Visibility API error:", error)

    return NextResponse.json({
      query: "",
      visibilityScore: 0,
      rankingPosition: "Error",
      rating: 0,
      competitors: []
    })

  }

}