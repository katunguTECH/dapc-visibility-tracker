"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MapPin, Globe, ShieldCheck, Zap, Search, ArrowRight, BarChart3 } from "lucide-react";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { isLoaded: sessionLoaded, session } = useSession();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  if (!sessionLoaded || !userLoaded) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse font-medium">
        Initializing Intelligence Engine...
      </div>
    );
  }

  const handleAudit = async () => {
    if (!business || business.length < 2) return;

    setLoading(true);
    setResult(null);

    try {
      const url = `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Audit UI Error:", error);
      alert("Search failed. Ensure your local dev server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* SEARCH BAR SECTION */}
      <div className="flex flex-col md:flex-row gap-3 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Business Name (e.g., Airtel)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
        </div>
        <div className="md:w-1/4 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Location"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 outline-none text-slate-800 focus:border-blue-500 transition-all font-medium"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          onClick={handleAudit}
          disabled={loading || !business}
          className="bg-blue-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest py-4 px-8 rounded-2xl disabled:opacity-50 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
        >
          {loading ? "Analyzing..." : "Run Audit"}
        </button>
      </div>

      {/* RESULTS SECTION */}
      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* 1. SCORE GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-5 bg-blue-50 rounded-3xl text-center border border-blue-100">
              <Zap className="mx-auto mb-2 text-blue-600" size={20} />
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Visibility</p>
              <p className="text-4xl font-black text-blue-900">{result.visibilityScore}%</p>
            </div>
            
            <div className="p-5 bg-white rounded-3xl text-center border border-slate-100 shadow-sm">
              <BarChart3 className="mx-auto mb-2 text-slate-400" size={20} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Market Rank</p>
              <p className="text-lg font-black text-slate-900 leading-tight mt-1">{result.ranking}</p>
            </div>

            <div className="p-5 bg-white rounded-3xl text-center border border-slate-100 shadow-sm">
              <MapPin className="mx-auto mb-2 text-slate-400" size={20} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Geo-Status</p>
              <p className={`text-lg font-black mt-1 ${result.geolocated ? "text-green-600" : "text-amber-500"}`}>
                {result.geolocated ? "Verified" : "Partial"}
              </p>
            </div>

            <div className="p-5 bg-white rounded-3xl text-center border border-slate-100 shadow-sm">
              <ShieldCheck className="mx-auto mb-2 text-slate-400" size={20} />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Trust Score</p>
              <p className="text-lg font-black text-slate-900 mt-1">{result.trust}</p>
            </div>
          </div>

          {/* 2. MARKET GAP VISUALIZATION */}
          <div className="mb-6 p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative border border-slate-800 shadow-2xl">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Market Gap Analysis</h5>
                  <p className="text-slate-400 text-xs font-medium">Benchmarked against industry leaders in {location}</p>
                </div>
                <span className="text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                  -{result.marketGap}% Behind
                </span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                    <span className="text-slate-300">{result.businessName}</span>
                    <span className="text-blue-400">{result.visibilityScore}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${result.visibilityScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                    <span className="text-slate-300">{result.topCompetitor}</span>
                    <span className="text-green-400">98%</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%] shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                  </div>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
          </div>

          {/* 3. AUDIT FINDINGS */}
          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200">
            <h4 className="font-black text-slate-900 text-xl tracking-tight uppercase mb-6 flex items-center gap-2">
              Critical Findings
            </h4>

            <div className="grid gap-3 mb-8">
              {result.recs?.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="mt-0.5">{rec.includes("✅") ? "🟢" : rec.includes("❌") ? "🔴" : "🟠"}</span>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    {rec.replace(/[✅❌⚠️🟢🔴🟠]/g, "").trim()}
                  </p>
                </div>
              ))}
            </div>

            {/* CALL TO ACTION */}
            <button
              onClick={() => session ? router.push("/subscribe") : router.push("/sign-in")}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              🚀 Unlock Full Competitor Lead Strategy
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* DISCOVERY MODE (For Very Low Scores) */}
      {result?.visibilityScore < 35 && !loading && (
        <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl text-center">
          <p className="text-amber-800 font-bold text-sm">
            Warning: Your digital visibility is in the "Danger Zone". Your business is effectively invisible to 80% of local customers.
          </p>
        </div>
      )}
    </div>
  );
}