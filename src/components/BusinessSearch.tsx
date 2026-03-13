"use client"

import { useState } from "react"

export default function BusinessSearch() {

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runAudit = async () => {

    console.log("Button clicked")

    if (!business || !location) {
      alert("Please enter a business and location")
      return
    }

    setLoading(true)

    try {

      const response = await fetch("/api/visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          business: business,
          location: location
        })
      })

      const data = await response.json()

      console.log("API result:", data)

      setResult(data)

    } catch (error) {

      console.error("Audit failed:", error)

    }

    setLoading(false)

  }

  return (

    <div className="max-w-2xl mx-auto space-y-6">

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
        className="bg-black text-white px-6 py-3 rounded w-full"
      >

        {loading ? "Running Audit..." : "Start Visibility Audit"}

      </button>

      {result && (

        <div className="border rounded p-4">

          <h2 className="font-bold mb-2">
            Visibility Results
          </h2>

          <p>
            Search Query Used: {result.query}
          </p>

          <p>
            Visibility Score: {result.visibilityScore}%
          </p>

          <p>
            Google Ranking: {result.rankingPosition}
          </p>

          <p>
            Customer Rating: {result.rating} ★
          </p>

        </div>

      )}

    </div>

  )

}