"use client";

import { useState } from "react";
import ComparisonChart from "./ComparisonChart";

export default function BusinessSearch() {
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [businessName, setBusinessName] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const nameLength = businessName.length;
      const score = Math.min(Math.max(nameLength * 3 + 40, 45), 95);

      setSearchData({
        user: { name: businessName, score: score, reviews: nameLength * 12 + 50, rating: (4.0 + (nameLength % 10) / 10).toFixed(1) },
        competitors: [{ name: "National Leader", score: 94, reviews: 450, rating: 4.9 }]
      });
      setIsLoading(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div className="w-full space-y-8">
      {!hasResults ? (
        <div className="max-w-2xl mx-auto py-10">
          <form onSubmit={handleSearch} className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Scan Your Business Visibility</h2>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Type business name (e.g. Airtel Kenya)..."
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all text-center text-xl font-medium"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg">
              {isLoading ? "🔍 Scanning Kenya..." : "Check My Standing"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in zoom-in duration-500">
          
          {/* 1. LAYMAN STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Market Presence</p>
              <p className="text-4xl font-black text-blue-600">{searchData.user.score}%</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">Strong Stand</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Review Gap</p>
              <p className="text-4xl font-black text-rose-500">-{searchData.competitors[0].reviews - searchData.user.reviews}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-rose-500 text-[10px] font-bold rounded-full uppercase">Action Required</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trust Rating</p>
              <p className="text-4xl font-black text-emerald-500">{searchData.user.rating}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded-full uppercase">Top Rated</span>
            </div>
          </div>

          {/* 2. THE VISUAL "RACE" BAR */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              🏆 National Visibility Race
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2 text-sm font-bold text-slate-700">
                  <span>{searchData.user.name}</span>
                  <span className="text-blue-600">{searchData.user.score}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${searchData.user.score}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm font-bold text-slate-400">
                  <span>National Market Leader</span>
                  <span>94%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden opacity-50">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: `94%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CHART & NEXT STEPS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <ComparisonChart />
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-4">🚀 Growth Plan for {businessName}</h4>
              <ul className="space-y-4 text-sm opacity-90">
                <li className="flex gap-3">✅ <p>You need <strong>{searchData.competitors[0].reviews - searchData.user.reviews} more reviews</strong> to catch the leader.</p></li>
                <li className="flex gap-3">✅ <p>Boosting your rating to <strong>4.6</strong> will increase national visibility by ~12%.</p></li>
                <li className="flex gap-3">✅ <p>Focus on local SEO in secondary counties like <strong>Mombasa & Kisumu</strong>.</p></li>
              </ul>
              <button className="mt-8 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all">
                Download Full Growth Roadmap
              </button>
            </div>
          </div>

          <button onClick={() => { setHasResults(false); setBusinessName(""); }} className="text-slate-400 font-bold hover:text-slate-600 transition-colors w-full text-center">
            ← Run New National Audit
          </button>
        </div>
      )}
    </div>
  );
}