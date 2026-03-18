"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import VisibilityGauge from "./VisibilityGauge"

export default function BusinessSearch() {

  const router = useRouter()

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runAudit = async () => {

    if (!business) return

    setLoading(true)

    try {

      const res = await fetch(
        `/api/audit?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      const data = await res.json()

      setResult(data)

    } catch (error) {

      console.error("Audit error:", error)

    }

    setLoading(false)

  }

  return (

    <div className="bg-white rounded-xl shadow-lg p-6">

      {/* Header */}

      <h2 className="text-2xl font-bold text-center mb-4">
        DAPC Visibility Audit
      </h2>

      <p className="text-center text-gray-500 mb-8">
        Real-time Kenyan market intelligence
      </p>

      {/* Inputs */}

      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Business name"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="border rounded-lg p-4 text-lg"
        />

        <input
          type="text"
          placeholder="City (e.g Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-4 text-lg"
        />

        <button
          onClick={runAudit}
          className="bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>

      </div>

      {/* Results */}

      {result && (

        <div className="mt-10">

          {/* Visibility Score */}

          <div className="text-center mb-8">

            <h3 className="text-xl font-semibold mb-4">
              Visibility Score
            </h3>

            <VisibilityGauge score={result.visibilityScore || 0} />

          </div>

          {/* Metrics */}

          <div className="grid grid-cols-2 gap-4 text-center mb-8">

            <div className="bg-gray-50 p-4 rounded-lg">

              <p className="text-gray-500">Google Rank</p>

              <p className="text-xl font-bold">
                {result.googleRank || "10+"}
              </p>

            </div>

            <div className="bg-gray-50 p-4 rounded-lg">

              <p className="text-gray-500">Trust Rating</p>

              <p className="text-xl font-bold">
                {result.trustRating || "N/A"}
              </p>

            </div>

            <div className="bg-gray-50 p-4 rounded-lg col-span-2">

              <p className="text-gray-500">Google Reviews</p>

              <p className="text-xl font-bold">
                {result.reviews || 0}
              </p>

            </div>

          </div>

          {/* Opportunities */}

          {result.opportunities && (

            <div className="mb-8">

              <h3 className="text-lg font-semibold mb-4">
                Visibility Opportunities
              </h3>

              <ul className="list-disc ml-6 text-gray-600">

                {result.opportunities.map((item: string, i: number) => (

                  <li key={i}>{item}</li>

                ))}

              </ul>

            </div>

          )}

          {/* Competitors */}

          {result.competitors && (

            <div className="mb-8">

              <h3 className="text-lg font-semibold mb-4">
                Competitor Visibility
              </h3>

              <div className="flex flex-col gap-3">

                {result.competitors.map((comp: any, i: number) => (

                  <div
                    key={i}
                    className="flex justify-between bg-gray-50 p-3 rounded-lg"
                  >

                    <span>{comp.name}</span>

                    <span className="font-semibold">
                      {comp.score}%
                    </span>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Leads Button */}

          <button
            onClick={() =>
              router.push(
                `/leads?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
              )
            }
            className="w-full bg-green-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            Find Leads for This Business
          </button>

        </div>

      )}

    </div>

  )

}