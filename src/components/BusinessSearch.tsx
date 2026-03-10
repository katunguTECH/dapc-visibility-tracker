"use client";

import { useState } from "react";
import ComparisonChart from "./ComparisonChart";

export default function BusinessSearch() {
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating AI Analysis fetching real-time data
    setTimeout(() => {
      setSearchData({
        user: { name: "DAPC (You)", score: 78, reviews: 150, rating: 4.7 },
        competitors: [
          { name: "Top Competitor", score: 92, reviews: 342, rating: 4.8 },
          { name: "Market Leader", score: 85, reviews: 210, rating: 4.6 },
          { name: "Local Challenger", score: 71, reviews: 98, rating: 4.4 },
        ]
      });
      setIsLoading(false);
      setHasResults(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!hasResults ? (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Analyze Market Visibility</h2>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Enter your business name..."
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:bg-slate-300"
            >
              {isLoading ? "🔍 Scanning Local Citations..." : "Start AI Analysis"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-100">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Your Score</p>
              <p className="text-4xl font-black">{searchData.user.score}%</p>
              <p className="text-sm mt-2 opacity-80">Ranked #3 in Nairobi</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Review Gap</p>
              <p className="text-4xl font-black text-slate-800">-{searchData.competitors[0].reviews - searchData.user.reviews}</p>
              <p className="text-sm mt-2 text-slate-500">vs. Market Leader</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg Rating</p>
              <p className="text-4xl font-black text-slate-800">{searchData.user.rating}</p>
              <p className="text-sm mt-2 text-green-500 font-medium">Above Average ★</p>
            </div>
          </div>

          {/* Graphical Visualization */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
             <ComparisonChart />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => setHasResults(false)}
              className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
            >
              ← Reset Search
            </button>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
              Save Full Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}