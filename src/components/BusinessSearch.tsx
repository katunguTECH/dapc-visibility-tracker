"use client";

import { useState } from "react";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!business) return;
    
    // 1. RESET EVERYTHING
    setLoading(true);
    setResult(null); 

    try {
      // 2. FETCH WITH CACHE BUSTING
      const response = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}&t=${Date.now()}`,
        { 
          method: 'GET',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        }
      );
      
      const data = await response.json();

      // 3. FORCE RE-RENDER WITH NEW OBJECT
      // We spread the data into a new object to ensure React detects the change
      setResult({ ...data });

    } catch (error) {
      console.error("Audit UI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Business Name"
          className="flex-1 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="md:w-1/3 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={handleAudit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Visibility Audit"}
        </button>
      </div>

      {/* 4. DYNAMIC UI RENDERING */}
      {result && !loading && (
        <div key={result.visibilityScore} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-xs text-blue-600 font-bold uppercase">Visibility Score</p>
              <p className="text-4xl font-black text-blue-900">{result.visibilityScore}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-bold uppercase">Google Rank</p>
              <p className="text-lg font-bold text-slate-900">{result.ranking || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-bold uppercase">Trust Rating</p>
              <p className="text-lg font-bold text-slate-900">{result.rating || "N/A"}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-left">
            <h4 className="font-bold text-slate-900 mb-4">Audit Insights for {business}</h4>
            <div className="space-y-3">
              {result.recs && result.recs.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span>{rec.includes('✅') ? '✅' : '⚠️'}</span>
                  <p>{rec.replace('✅', '').replace('⚠️', '').replace('❌', '')}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all">
              🚀 Find Leads for {business} →
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="py-12 text-center text-slate-400">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          p-Calculating real-time metrics for {business}...
        </div>
      )}
    </div>
  );
}