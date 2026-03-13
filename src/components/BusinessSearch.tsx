"use client"

import { useState } from "react"

export default function BusinessSearch() {

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runAudit = async () => {

    if (!business || !location) {
      alert("Please enter a business and location")
      return
    }

    setLoading(true)
    setResult(null)

    try {

      const res = await fetch("/api/visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          business,
          location
        })
      })

      const data = await res.json()

      setResult(data)

    } catch (err) {

      console.error("Audit error:", err)

    }

    setLoading(false)

  }

  const scoreColor = (score:number) => {

    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"

  }

  return (

    <div className="max-w-2xl mx-auto space-y-6">

      {/* Search Inputs */}

      <div className="space-y-3">

        <input
          className="border p-3 rounded w-full"
          placeholder="Business name (e.g Safaricom)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="City (e.g Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded w-full"
        >

          {loading ? "Analyzing Google Results..." : "Start Visibility Audit"}

        </button>

      </div>

      {/* Results */}

      {result && (

        <div className="border rounded-lg p-6 space-y-5 bg-white shadow">

          <h2 className="text-xl font-bold">
            Visibility Results
          </h2>

          {/* Query */}

          <p className="text-gray-600">
            Search Query Used: <span className="font-semibold">{result.query}</span>
          </p>

          {/* Visibility Score */}

          <div>

            <div className="flex justify-between mb-1">

              <span className="font-semibold">
                Visibility Score
              </span>

              <span className="font-bold">
                {result.visibilityScore}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded h-4">

              <div
                className={`${scoreColor(result.visibilityScore)} h-4 rounded`}
                style={{ width: `${result.visibilityScore}%` }}
              />

            </div>

          </div>

          {/* Ranking + Rating */}

          <div className="grid grid-cols-2 gap-4">

            <div className="border p-4 rounded bg-gray-50">

              <p className="text-sm text-gray-500">
                Google Ranking
              </p>

              <p className="text-lg font-bold">

                {result.rankingPosition}

              </p>

            </div>

            <div className="border p-4 rounded bg-gray-50">

              <p className="text-sm text-gray-500">
                Customer Rating
              </p>

              <p className="text-lg font-bold">

                {result.rating} ★

              </p>

            </div>

          </div>

          {/* Competitors */}

          {result.competitors?.length > 0 && (

            <div>

              <h3 className="font-semibold mb-2">
                Top Competitors
              </h3>

              <ul className="list-disc list-inside text-sm text-gray-700">

                {result.competitors.map((c:any, i:number) => (

                  <li key={i}>{c.name}</li>

                ))}

              </ul>

            </div>

          )}

        </div>

      )}

    </div>

  )

}