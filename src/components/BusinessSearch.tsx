"use client";

import { useState } from "react";
import ComparisonChart from "./ComparisonChart";

export default function BusinessSearch() {
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating an API call to your AI backend
    setTimeout(() => {
      setIsLoading(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {!hasResults ? (
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">AI Competitor Visibility Analysis</label>
            <input 
              type="text" 
              placeholder="Enter business name (e.g., DAPC)..."
              className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md disabled:bg-slate-400"
          >
            {isLoading ? "Analyzing Market Data..." : "Analyze Competitors"}
          </button>
        </form>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* New Visual Chart */}
          <ComparisonChart />

          {/* Enhanced Competitor List */}
          <div className="grid gap-4">
            <h3 className="font-bold text-slate-800 text-lg">Detailed Breakdown</h3>
            
            <div className="flex items-center justify-between p-4 bg-white border-l-4 border-blue-600 shadow-sm rounded-r-lg">
              <div>
                <p className="font-bold text-slate-900">DAPC (You)</p>
                <p className="text-sm text-slate-500">150 Reviews</p>
              </div>
              <div className="text-right">
                <span className="text-blue-600 font-bold text-xl">4.7</span>
                <p className="text-xs font-bold text-blue-500 uppercase">78% Score</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border-l-4 border-slate-300 rounded-r-lg">
              <div>
                <p className="font-bold text-slate-700">Top Ranked Competitor</p>
                <p className="text-sm text-slate-500">342 Reviews</p>
              </div>
              <div className="text-right">
                <span className="text-slate-700 font-bold text-xl">4.8</span>
                <p className="text-xs font-bold text-slate-400 uppercase">92% Score</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setHasResults(false)}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            ← Back to New Search
          </button>
        </div>
      )}
    </div>
  );
}