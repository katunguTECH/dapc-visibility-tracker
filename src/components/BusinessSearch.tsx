"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import VisibilityGauge from "./VisibilityGauge" // Fixed relative import

export default function BusinessSearch() {
  // 1. Hooks (Initialized at the top level)
  const router = useRouter()
  const { isSignedIn } = useAuth()
  
  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // 2. Logic: Running the Visibility Audit
  const runAudit = async () => {
    if (!business) return
    setLoading(true)

    try {
      // Calling your Next.js API route
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error("Audit error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // 3. Logic: Redirecting to Subscription/Leads
  const handleFindLeads = () => {
    if (!isSignedIn) {
      // Redirect to Clerk Sign-up, then to the subscription page
      router.push("/sign-up?redirect_url=/subscribe")
    } else {
      // If already signed in, go straight to the subscription/payment page
      router.push("/subscribe")
    }
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 transition-all duration-300">
      {/* Header Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-1">DAPC Audit Tool</h2>
        <p className="text-slate-500 text-sm italic">Analyze your digital footprint in Kenya</p>
      </div>

      {/* Search Form */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Business Name (e.g. Langata Hospital)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full border border-slate-200 rounded-2xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <input
          type="text"
          placeholder="City/Town (e.g. Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-slate-200 rounded-2xl p-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-blue-600 text-white p-4 rounded-2xl text-lg font-black hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-blue-300 shadow-lg shadow-blue-100"
        >
          {loading ? "Searching Live Data..." : "Run Visibility Audit"}
        </button>
      </div>

      {/* Results Animation Section */}
      {result && (
        <div className="mt-10 pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Visibility Score</h3>
            {/* The Gauge Component in Action */}
            <VisibilityGauge score={result.visibilityScore || 0} />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Rank</p>
              <p className="text-xl font-bold text-slate-900">{result.ranking || "Not Found"}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Rating</p>
              <p className="text-xl font-bold text-slate-900">{result.rating || "N/A"}</p>
            </div>
          </div>

          {/* The Conversion Button */}
          <button
            onClick={handleFindLeads}
            className="w-full bg-emerald-600 text-white p-5 rounded-2xl text-lg font-black hover:bg-emerald-700 hover:shadow-emerald-200 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            🚀 Find Leads for {business}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
            Unlock contact info & directory gaps
          </p>
        </div>
      )}
    </div>
  )
}