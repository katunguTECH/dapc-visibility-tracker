"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import VisibilityGauge from "./VisibilityGauge"

export default function BusinessSearch() {
  // 1. Hooks
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
    setResult(null) // Reset results for new search

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      )

      if (!res.ok) throw new Error("Search failed")

      const data = await res.json()
      setResult(data)
    } catch (error) {
      console.error("Audit error:", error)
      alert("Something went wrong. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // 3. Logic: Redirecting to Subscription/Leads
  const handleFindLeads = () => {
    if (!isSignedIn) {
      router.push("/sign-up?redirect_url=/subscribe")
    } else {
      router.push("/subscribe")
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 transition-all duration-500">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2">DAPC Audit Tool</h2>
        <p className="text-slate-500 text-sm font-medium italic">
          Real-time market intelligence for Kenyan enterprises
        </p>
      </div>

      {/* Search Form */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Business Name (e.g. Safaricom)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="w-full border-2 border-slate-100 rounded-2xl p-5 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300 font-medium"
          />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="City/Town (e.g. Nairobi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border-2 border-slate-100 rounded-2xl p-5 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300 font-medium"
          />
        </div>

        <button
          onClick={runAudit}
          disabled={loading}
          className="bg-blue-600 text-white p-5 rounded-2xl text-xl font-black hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:text-slate-400 shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
              Analyzing Market...
            </>
          ) : (
            "Run Visibility Audit"
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-12 pt-12 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Gauge Display */}
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
              Visibility Score
            </h3>
            <VisibilityGauge score={result.visibilityScore || 0} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Rank</p>
              <p className="text-xl font-bold text-slate-900">{result.ranking || "Not Found"}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Rating</p>
              <p className="text-xl font-bold text-slate-900">{result.rating || "N/A"}</p>
            </div>
          </div>

          {/* Audit Insights (The New Dynamic Section) */}
          {result.recs && result.recs.length > 0 && (
            <div className="mb-10 p-7 bg-blue-50/50 rounded-[2rem] border border-blue-100 text-left">
              <h4 className="text-[11px] font-black text-blue-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Audit Insights for {business}
              </h4>
              <ul className="space-y-4">
                {result.recs.map((rec: string, index: number) => (
                  <li key={index} className="text-sm text-slate-700 flex gap-4 leading-relaxed font-medium">
                    <span className="flex-shrink-0 text-base">
                      {rec.includes('✅') ? '💎' : '⚠️'}
                    </span>
                    {rec.replace('✅', '').replace('❌', '')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conversion Button */}
          <button
            onClick={handleFindLeads}
            className="w-full bg-emerald-600 text-white p-6 rounded-2xl text-xl font-black hover:bg-emerald-700 hover:shadow-emerald-200 transition-all shadow-xl flex items-center justify-center gap-3 group"
          >
            🚀 Find Leads for {business}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase font-black tracking-[0.2em] opacity-80">
            Unlock contact info & fix directory gaps
          </p>
        </div>
      )}
    </div>
  )
}