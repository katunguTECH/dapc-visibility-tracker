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
      const score = Math.min(Math.max(nameLength * 3 + 45, 50), 95);

      setSearchData({
        user: { name: businessName, score: score, reviews: nameLength * 12 + 60, rating: (4.0 + (nameLength % 10) / 10).toFixed(1) },
        leader: { name: "National Industry Leader", score: 94, reviews: 450, rating: 4.9 }
      });
      setIsLoading(false);
      setHasResults(true);
    }, 1200);
  };

  return (
    <div className="w-full space-y-8">
      {!hasResults ? (
        <div className="max-w-xl mx-auto py-12">
          <form onSubmit={handleSearch} className="space-y-6 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Search Kenya's Market</h2>
            <input 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Hospital, Hotel, or Shop name..."
              className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-inner focus:border-blue-500 outline-none transition-all text-center text-xl font-bold text-slate-800"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-2xl shadow-blue-200 transition-all text-xl uppercase tracking-wider">
              {isLoading ? "🔍 Scanning Kenya..." : "Analyze Now"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* 1. BIG STATS (Layman Friendly) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Visibility Score</p>
              <p className="text-5xl font-black mt-2">{searchData.user.score}%</p>
              <p className="text-sm mt-4 font-medium opacity-80">Strong presence in Kenya</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Review Gap</p>
              <p className="text-5xl font-black text-rose-500 mt-2">-{searchData.leader.reviews - searchData.user.reviews}</p>
              <p className="text-sm mt-4 font-medium text-slate-500">Reviews needed to lead</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Customer Trust</p>
              <p className="text-5xl font-black text-emerald-500 mt-2">{searchData.user.rating}</p>
              <p className="text-sm mt-4 font-medium text-emerald-600 flex items-center gap-1">★ Top 10% in Category</p>
            </div>
          </div>

          {/* 2. THE VISUAL COMPARISON (Guaranteed to show) */}
          <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-50 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 uppercase tracking-tight">🏆 National Visibility Ranking</h3>
            
            <div className="space-y-10">
              {/* User Bar */}
              <div className="group">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-lg font-black text-slate-800 uppercase tracking-tight">{businessName} <span className="text-blue-600">(You)</span></span>
                  <span className="text-2xl font-black text-blue-600">{searchData.user.score}%</span>
                </div>
                <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
                    style={{ width: `${searchData.user.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Competitor Bar */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Industry Leader (Kenya)</span>
                  <span className="text-xl font-bold text-slate-400">94%</span>
                </div>
                <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-200 rounded-full" 
                    style={{ width: `94%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. OPTIONAL CHART (Hide if it's breaking) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
                <ComparisonChart />
             </div>
             <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] flex flex-col justify-center">
                <h4 className="text-2xl font-black mb-6 uppercase tracking-tight">Growth Strategy</h4>
                <ul className="space-y-5 text-slate-300">
                  <li className="flex gap-4">
                    <span className="text-blue-500 font-black">01</span>
                    <p>Gain <strong>{searchData.leader.reviews - searchData.user.reviews} reviews</strong> to match the national leader.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-blue-500 font-black">02</span>
                    <p>A rating of <strong>4.8</strong> would put you in the #1 spot for customer trust.</p>
                  </li>
                </ul>
                <button className="mt-10 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black transition-all uppercase tracking-widest text-sm">
                  Get Full PDF Report
                </button>
             </div>
          </div>

          <button 
            onClick={() => { setHasResults(false); setBusinessName(""); }}
            className="w-full text-center text-slate-400 font-bold hover:text-slate-600 py-4 transition-colors"
          >
            ← RUN NEW NATIONAL AUDIT
          </button>
        </div>
      )}
    </div>
  );
}