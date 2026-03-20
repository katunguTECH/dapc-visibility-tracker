"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs" // Ensure this is imported correctly
import VisibilityGauge from "./VisibilityGauge"

export default function BusinessSearch() {
  // 1. Hook definitions (MUST be at the top level)
  const router = useRouter()
  const { isSignedIn } = useAuth()
  
  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // 2. The Logic function
  const runAudit = async () => {
    if (!business) return
    setLoading(true)

    try {
      // Calling our live API route
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

  // 3. The Redirect Handler
  const handleFindLeads = () => {
    if (!isSignedIn) {
      // Forces sign-up then redirects back to /leads
      router.push("/sign-up?redirect_url=/leads")
    } else {
      router.push(`/leads?business=${encodeURIComponent(business)}`)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 transition-all">
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
        <input
          type="text"
          placeholder="Business Name (e.g. Safaricom)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <input
          type="text"
          placeholder="City (e.g. Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-blue-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300 shadow-lg shadow-blue-200"
        >
          {loading ? "Analyzing Live Data..." : "Run Visibility Audit"}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-12 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Your Visibility Score</h3>
            <VisibilityGauge score={result.visibilityScore || 0} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Google Rank</p>
              <p className="text-2xl font-bold text-slate-900">{result.ranking}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trust Rating</p>
              <p className="text-2xl font-bold text-slate-900">{result.rating}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 col-span-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Social Presence</p>
              <p className="text-lg font-bold text-slate-900">
                {result.platforms?.join(", ") || "Web Only"}
              </p>
            </div>
          </div>

          {/* Call to Action - The Subscription Gate */}
          <button
            onClick={handleFindLeads}
            className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
          >
            Find Leads for {business}
          </button>
        </div>
      )}
    </div>
  )
}