import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const { business, location } = await req.json()

    const query = `${business} ${location}`

    const url =
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&hl=en&gl=ke&api_key=${process.env.SERP_API_KEY}`

    const response = await fetch(url)

    const data = await response.json()

    const organic = data.organic_results || []
    const local = data.local_results || []

    let rankingPosition = -1

    organic.forEach((r:any,i:number)=>{

      if(
        r.title?.toLowerCase().includes(business.toLowerCase()) ||
        r.link?.toLowerCase().includes(business.toLowerCase())
      ){
        rankingPosition = i
      }

    })

    let visibilityScore = 0

    if (rankingPosition === 0) visibilityScore = 100
    else if (rankingPosition <= 2 && rankingPosition >= 0) visibilityScore = 80
    else if (rankingPosition <= 5 && rankingPosition >= 0) visibilityScore = 60
    else if (rankingPosition <= 9 && rankingPosition >= 0) visibilityScore = 40
    else visibilityScore = 10

    const rating =
      local[0]?.rating ||
      data.knowledge_graph?.rating ||
      0

    return NextResponse.json({

      usedQuery: query,

      visibilityScore,

      rankingPosition,

      rating

    })

  } catch (error) {

    console.log(error)

    return NextResponse.json({

      usedQuery: "",
      visibilityScore: 0,
      rankingPosition: -1,
      rating: 0

    })

  }

}