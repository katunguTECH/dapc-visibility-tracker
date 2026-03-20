"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import VisibilityGauge from "./VisibilityGauge" // Ensure this component exists

export default function BusinessSearch() {
  // 1. Hooks (Must be inside the function)
  const router = useRouter()
  const { isSignedIn } = useAuth()
  
  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // 2. Logic Functions
  const runAudit = async () => {
    if (!business) return
    setLoading(true)
    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )
      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error("Audit error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFindLeads = () => {
    if (!isSignedIn) {
      router.push("/sign-up?redirect_url=/subscribe")
    } else {
      router.push("/subscribe")
    }
  }

  // 3. Render (The JSX)
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      {/* Input Group */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Business Name (e.g. Safaricom)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          placeholder="City (e.g. Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-slate-200 rounded-xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-blue-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all disabled:bg-blue-300"
        >
          {loading ? "Analyzing..." : "Run Visibility Audit"}
        </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex flex-col items-center mb-6">
            <VisibilityGauge score={result.visibilityScore || 0} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase">Rank</p>
              <p className="text-xl font-bold">{result.ranking || "N/A"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase">Trust</p>
              <p className="text-xl font-bold">{result.rating || "N/A"}</p>
            </div>
          </div>

          <button
            onClick={handleFindLeads}
            className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg"
          >
            Find Leads for {business}
          </button>
        </div>
      )}
    </div>
  )
}