"use client"

import { useState } from "react"
import { calculateVisibilityScore } from "@/lib/calculateVisibilityScore"

interface AuditResult {
  score: number
  googleRank: string
  opportunities: string[]
}

interface Competitor {
  name: string
  score: number
}

export default function BusinessSearch() {

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  const [visibilityScore, setVisibilityScore] = useState<number | null>(null)
  const [googleRank, setGoogleRank] = useState<string>("")
  const [trustRating, setTrustRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState<number | null>(null)

  const [opportunities, setOpportunities] = useState<string[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [leadOpportunity, setLeadOpportunity] = useState(false)

  async function runAudit() {

    if (!business) return

    setLoading(true)

    try {

      const res = await fetch(
        `/api/audit?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      const data = await res.json()

      const mapsData = data.maps || null
      const website = data.website || ""
      const rating = mapsData?.rating || 0
      const reviews = mapsData?.reviews || 0

      const facebook = data.social?.facebook || ""
      const instagram = data.social?.instagram || ""
      const twitter = data.social?.twitter || ""
      const linkedin = data.social?.linkedin || ""

      const directoryCount = data.directories || 0

      const result: AuditResult = calculateVisibilityScore({
        businessName: business,
        mapsFound: !!mapsData,
        website,
        rating,
        reviewCount: reviews,
        facebook,
        instagram,
        twitter,
        linkedin,
        directories: directoryCount
      })

      setVisibilityScore(result.score)
      setGoogleRank(result.googleRank)
      setTrustRating(rating)
      setReviewCount(reviews)
      setOpportunities(result.opportunities)

      // -------- LEAD GENERATION DETECTION --------
      if (result.score < 40) {
        setLeadOpportunity(true)
      } else {
        setLeadOpportunity(false)
      }

      // -------- COMPETITOR SIMULATION --------
      const competitorList: Competitor[] = [
        {
          name: `${business} Competitor 1`,
          score: Math.floor(Math.random() * 40) + 50
        },
        {
          name: `${business} Competitor 2`,
          score: Math.floor(Math.random() * 40) + 40
        },
        {
          name: `${business} Competitor 3`,
          score: Math.floor(Math.random() * 40) + 30
        }
      ]

      setCompetitors(competitorList)

    } catch (error) {

      console.error("Audit failed:", error)

    }

    setLoading(false)

  }

  return (

    <div className="max-w-2xl mx-auto p-6">

      <h2 className="text-3xl font-bold mb-2">
        DAPC Visibility Audit
      </h2>

      <p className="text-gray-500 mb-6">
        Real-time Kenyan market intelligence
      </p>

      {/* Search Form */}

      <div className="flex flex-col gap-3 mb-6">

        <input
          type="text"
          placeholder="Business name"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          type="text"
          placeholder="City (example: Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-3 rounded"
        />

        <button
          onClick={runAudit}
          className="bg-black text-white p-3 rounded hover:bg-gray-800"
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>

      </div>

      {/* RESULTS */}

      {visibilityScore !== null && (

        <div className="space-y-6">

          {/* SCORE CARD */}

          <div className="border rounded p-5">

            <h3 className="text-xl font-semibold mb-4">
              Visibility Score
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-gray-500">Score</p>
                <p className="text-3xl font-bold">{visibilityScore}%</p>
              </div>

              <div>
                <p className="text-gray-500">Google Rank</p>
                <p className="text-xl">{googleRank}</p>
              </div>

              <div>
                <p className="text-gray-500">Trust Rating</p>
                <p className="text-xl">{trustRating}</p>
              </div>

              <div>
                <p className="text-gray-500">Google Reviews</p>
                <p className="text-xl">{reviewCount}</p>
              </div>

            </div>

          </div>

          {/* OPPORTUNITIES */}

          <div className="border rounded p-5">

            <h3 className="font-semibold mb-3">
              Visibility Opportunities
            </h3>

            <ul className="list-disc pl-5 text-sm text-gray-600">
              {opportunities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

          </div>

          {/* COMPETITORS */}

          <div className="border rounded p-5">

            <h3 className="font-semibold mb-3">
              Competitor Visibility
            </h3>

            <div className="space-y-2">

              {competitors.map((c, i) => (

                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >
                  <span>{c.name}</span>
                  <span className="font-semibold">{c.score}%</span>
                </div>

              ))}

            </div>

          </div>

          {/* LEAD OPPORTUNITY */}

          {leadOpportunity && (

            <div className="border border-red-300 bg-red-50 p-5 rounded">

              <h3 className="font-semibold text-red-600 mb-2">
                Business Visibility Alert
              </h3>

              <p className="text-sm text-red-700">
                This business has weak digital visibility.  
                This is a strong opportunity for marketing, SEO,
                or social media improvement.
              </p>

            </div>

          )}

        </div>

      )}

    </div>

  )
}