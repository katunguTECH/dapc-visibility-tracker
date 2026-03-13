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

    try {
      const res = await fetch("/api/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, location }),
      })

      const data = await res.json()
      console.log("API RESULT:", data)
      setResult(data)
    } catch (err) {
      console.error("Audit error:", err)
      alert("Error running visibility audit. Check console.")
    }

    setLoading(false)
  }

  const getVisibilityColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <input
        className="border p-3 rounded w-full"
        placeholder="Business name"
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
      />

      <input
        className="border p-3 rounded w-full"
        placeholder="City"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button
        onClick={runAudit}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded w-full hover:bg-gray-800"
      >
        {loading ? "Running Audit..." : "Start Visibility Audit"}
      </button>

      {result && (
        <div className="border p-4 rounded space-y-3 bg-white shadow-sm">
          <h2 className="font-bold text-lg mb-2">Visibility Results</h2>

          <p>
            <strong>Search Query Used:</strong>{" "}
            {result.query || `${business} ${location}`}
          </p>

          <div className="space-y-1">
            <p>
              <strong>Visibility Score:</strong> {result.visibilityScore}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${getVisibilityColor(
                  result.visibilityScore
                )} h-4 rounded-full`}
                style={{ width: `${result.visibilityScore}%` }}
              />
            </div>
          </div>

          <p>
            <strong>Google Ranking:</strong>{" "}
            <span
              className={
                result.rankingPosition && result.rankingPosition !== "Not Found"
                  ? "text-green-600 font-bold"
                  : "text-red-600 font-bold"
              }
            >
              {result.rankingPosition}
            </span>
          </p>

          <p>
            <strong>Customer Rating:</strong>{" "}
            <span className="text-yellow-500 font-bold">{result.rating} ★</span>
          </p>
        </div>
      )}
    </div>
  )
}
