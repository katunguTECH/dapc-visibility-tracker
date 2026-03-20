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
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      if (!res.ok) throw new Error("Network response was not ok")

      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error("Audit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          DAPC Visibility Audit
        </h2>
        <p className="text-slate-500">
          Real-time Kenyan market intelligence
        </p>
      </div>

      {/* Input Group */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Business Name (e.g. DAPC Tech)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="City (e.g. Nairobi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-blue-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300 shadow-lg shadow-blue-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing Market Data...
            </span>
          ) : "Run Visibility Audit"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-12 pt-8 border-t border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Your Visibility Score</h3>
            <VisibilityGauge score={result.visibilityScore || 0} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Google Rank</p>
              <p className="text-2xl font-bold text-slate-900">{result.ranking || "10+"}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trust Rating</p>
              <p className="text-2xl font-bold text-slate-900">{result.rating || "N/A"}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 col-span-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Google Reviews</p>
              <p className="text-2xl font-bold text-slate-900">{result.reviews || 0}</p>
            </div>
          </div>

          {/* Lead Generation CTA */}
          <button
            onClick={() => router.push(`/leads?business=${encodeURIComponent(business)}`)}
            className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
          >
            Find Leads for {business}
          </button>
        </div>
      )}
    </div>
  )
}