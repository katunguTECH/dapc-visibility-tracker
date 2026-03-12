"use client"

import { useState } from "react"
import VisibilityDashboard from "./VisibilityDashboard"

export default function BusinessSearch() {

  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const runAudit = async () => {

    if (!business || !location) return

    setLoading(true)
    setData(null)

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

      const result = await res.json()

      setData(result)

    } catch (err) {

      console.error("Audit failed", err)

    }

    setLoading(false)

  }

  return (

    <div className="space-y-6">

      <div className="flex flex-col gap-4 max-w-xl">

        <input
          className="border p-3 rounded-lg"
          placeholder="Business name (e.g Airtel Kenya)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />

        <input
          className="border p-3 rounded-lg"
          placeholder="City (e.g Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-black text-white p-3 rounded-lg flex items-center justify-center gap-2"
        >

          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Running Audit...
            </>
          ) : (
            "Start Visibility Audit"
          )}

        </button>

      </div>

      {loading && (
        <p className="text-gray-500">
          Analyzing Google search results...
        </p>
      )}

      {data && (
        <VisibilityDashboard data={data} />
      )}

    </div>
  )
}