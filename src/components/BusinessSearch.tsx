"use client";

import { useState } from "react";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!business) return;
    setLoading(true);
    setResult(null); // 1. CLEAR OLD RESULTS IMMEDIATELY

    try {
      // 2. ADD TIMESTAMP (?t=) to bypass browser caching
      const response = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      
      const data = await response.json();

      // 3. UPDATE STATE WITH FRESH DATA
      setResult({
        visibilityScore: data.visibilityScore,
        ranking: data.ranking,
        rating: data.rating,
        recs: data.recs || []
      });
    } catch (error) {
      console.error("Audit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Business Name (e.g. Langata Hospital)"
          className="flex-1 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          className="md:w-1/3 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={handleAudit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Auditing..." : "Run Visibility Audit"}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-2xl text-center">
              <p className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Visibility Score</p>
              <p className="text-4xl font-black text-blue-900">{result.visibilityScore}%</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Google Rank</p>
              <p className="text-xl font-bold text-slate-900">{result.ranking}</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl text-center">
              <p className="text-sm text-slate-500 font-bold mb-1 uppercase tracking-wider">Trust Rating</p>
              <p className="text-xl font-bold text-slate-900">{result.rating}</p>
            </div>
          </div>

          <div className="text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4">Audit Insights for {business}</h4>
            <ul className="space-y-3">
              {result.recs.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                  <span className="text-blue-500">
                    {rec.includes('✅') ? '✅' : rec.includes('❌') ? '⚠️' : '💎'}
                  </span>
                  {rec.replace(/✅|❌/g, '')}
                </li>
              ))}
            </ul>

            <button className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
              🚀 Find Leads for {business} <span className="text-slate-400">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}