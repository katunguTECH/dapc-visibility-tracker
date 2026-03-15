"use client"

import { useState } from "react"

export default function BusinessSearch() {

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runAudit = async () => {

    if (!business) return

    setLoading(true)

    try {

      const res = await fetch(
        `/api/audit?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      const data = await res.json()

      setResults(data)

    } catch (error) {

      console.error("Audit failed", error)

    }

    setLoading(false)
  }

  return (

    <div className="space-y-6">

      {/* Search Inputs */}

      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Business name"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="border rounded-lg p-3"
        />

        <input
          type="text"
          placeholder="City (e.g Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-3"
        />

        <button
          onClick={runAudit}
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>

      </div>

      {/* Results */}

      {results && (

        <div className="space-y-6 mt-6">

          {/* Visibility Score */}

          <div className="border rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-2">
              Visibility Score
            </h2>

            <div className="text-4xl font-bold text-blue-600">
              {results.visibilityScore}%
            </div>

          </div>

          {/* Competitors */}

          <div className="border rounded-lg p-6">

            <h2 className="text-lg font-semibold mb-4">
              Competitor Visibility
            </h2>

            <div className="space-y-2">

              {results.competitors?.map((c: any, i: number) => (

                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >

                  <span>{c.name}</span>

                  <span className="font-semibold">
                    {c.score}%
                  </span>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}

    </div>

  )
}