"use client";

import { useState } from "react";
import ComparisonChart from "@/components/ComparisonChart";
// This works from anywhere in the app

export default function BusinessSearch() {
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);
  const [businessName, setBusinessName] = useState(""); // Track the typed name

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Kenya-wide market analysis for the SPECIFIC business typed
    setTimeout(() => {
      setSearchData({
        user: { name: `${businessName} (You)`, score: 78, reviews: 150, rating: 4.7 },
        competitors: [
          { name: "Market Leader", score: 92, reviews: 342, rating: 4.8 },
          { name: "Top Competitor", score: 85, reviews: 210, rating: 4.6 },
          { name: "Local Challenger", score: 71, reviews: 98, rating: 4.4 },
        ]
      });
      setIsLoading(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div className="w-full space-y-8">
      {!hasResults ? (
        <div className="max-w-2xl mx-auto py-10">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Business Name</label>
              <input 
                type="text" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)} // Update name as user types
                placeholder="Enter business name (e.g. DAPC)..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg text-slate-900"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing {businessName}...
                </>
              ) : "Start AI Visibility Audit"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          {/* Dashboard Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-50">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Analysis for {businessName}</p>
              <p className="text-4xl font-black mt-1">{searchData.user.score}%</p>
              <p className="text-sm mt-3 opacity-90 font-medium">National Visibility Score</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Review Gap</p>
              <p className="text-4xl font-black text-slate-800 mt-1">-{searchData.competitors[0].reviews - searchData.user.reviews}</p>
              <p className="text-sm mt-3 text-slate-500 italic">vs. Industry Leader</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Quality Rating</p>
              <p className="text-4xl font-black text-slate-800 mt-1">{searchData.user.rating}</p>
              <p className="text-sm mt-3 text-green-600 font-bold">★ Above Market Avg</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <ComparisonChart />
          </div>

          {/* Table Breakdown - NOW DYNAMIC */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 px-2">Market Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-600">
                <span className="font-bold text-slate-900">{businessName} (You)</span>
                <span className="text-blue-600 font-black">{searchData.user.score}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">Top Ranked Competitor</span>
                <span className="text-slate-800 font-bold">92%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button 
              onClick={() => { setHasResults(false); setBusinessName(""); }}
              className="text-slate-400 font-bold hover:text-slate-600 transition-colors order-2 md:order-1"
            >
              ← Run New National Audit
            </button>
            <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all order-1 md:order-2">
              Export Growth PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}