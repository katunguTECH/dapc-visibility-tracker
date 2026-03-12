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

    // Detect business ranking
    organic.forEach((r: any, i: number) => {

      const title = r.title?.toLowerCase() || ""
      const snippet = r.snippet?.toLowerCase() || ""
      const link = r.link?.toLowerCase() || ""

      const name = business.toLowerCase()

      if (
        rankingPosition === -1 &&
        (
          title.includes(name) ||
          snippet.includes(name) ||
          link.includes(name.replace(" ", ""))
        )
      ) {
        rankingPosition = i
      }

    })

    // Extract competitors
    const competitors = organic.slice(0, 5).map((r: any) => ({
      name: r.title
    }))

    // Extract rating from Google Maps results
    let rating = 0

    if (local.length > 0) {
      rating = local[0].rating || 0
    }

    // Visibility scoring logic
    let visibilityScore = 10

    if (rankingPosition === 0) visibilityScore = 100
    else if (rankingPosition <= 2 && rankingPosition >= 0) visibilityScore = 80
    else if (rankingPosition <= 5 && rankingPosition >= 0) visibilityScore = 60
    else if (rankingPosition <= 9 && rankingPosition >= 0) visibilityScore = 40
    else if (rankingPosition === -1) visibilityScore = 10

    return NextResponse.json({
      query,
      visibilityScore,
      rankingPosition,
      rating,
      competitors
    })

  } catch (error) {

    console.error("Visibility API Error:", error)

    return NextResponse.json({
      query: "",
      visibilityScore: 0,
      rankingPosition: -1,
      rating: 0,
      competitors: []
    })

  }

}