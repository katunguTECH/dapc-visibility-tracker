"use client";
import React, { useState } from 'react';
import CompetitorTable from '@/components/CompetitorTable';
import { Search, Loader2, AlertCircle, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const startAudit = async () => {
    if (!query) return;
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/api/audit?business=${encodeURIComponent(query)}`);
      const result = await res.json();
      setData(result);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ORIGINAL NAVIGATION */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="font-black text-xl tracking-tighter text-blue-600">DAPC</div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exposure</a>
          <a href="#" className="hover:text-blue-600">Leads</a>
        </div>
        <button className="text-sm font-bold bg-white border px-5 py-2 rounded-full shadow-sm hover:bg-slate-50">Sign In</button>
      </nav>

      <main className="max-w-4xl mx-auto pt-16 pb-24 px-6">
        {/* ORIGINAL HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Stop Guessing Your <span className="text-blue-600">Digital Impact.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get real-time Kenyan market intelligence. Audit your business visibility across Google, Social Media, and local directories in seconds.
          </p>
        </div>

        {/* SEARCH BAR (RESET TO ORIGINAL STYLE) */}
        <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 flex flex-col md:flex-row gap-2 mb-16">
          <input 
            className="flex-1 px-6 py-4 rounded-2xl outline-none text-slate-700 font-medium placeholder:text-slate-400"
            placeholder="Search your business (e.g. Java House)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />
          <button 
            onClick={startAudit} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* CONDITIONAL RESULTS SECTION */}
        {data && (
          data.score === 0 ? (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-700 flex items-center gap-4 animate-in fade-in zoom-in">
              <AlertCircle className="shrink-0" />
              <p><strong>Identity Not Found:</strong> We couldn't verify a business matching "{query}" in Kenya. Please check the spelling.</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border shadow-sm text-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Visibility Score</span>
                  <div className="text-7xl font-black text-blue-600 mt-2">{data.score}%</div>
                  <div className="mt-4 inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-tighter">
                    {data.rank}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-slate-900">{data.businessName}</h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">📍 {data.address}</p>
                  <div className="mt-4 flex gap-4">
                     <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Trust: {data.trust}</div>
                  </div>
                </div>
              </div>

              {/* COMPETITOR COMPARISON TABLE */}
              {data.competitors && (
                <CompetitorTable competitors={data.competitors} currentBusiness={data.businessName} />
              )}
              
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">
                 🚀 Find Leads for {data.businessName} →
              </button>
            </div>
          )
        )}

        {/* ORIGINAL BOTTOM FEATURES (RESTORED) */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6">
              <ShieldCheck className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900">Local Accuracy</h3>
              <p className="text-sm text-slate-500 mt-2">Tailored specifically for the Kenyan business landscape.</p>
            </div>
            <div className="p-6">
              <TrendingUp className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900">Competitor Insights</h3>
              <p className="text-sm text-slate-500 mt-2">See how you stack up against other players in your city.</p>
            </div>
            <div className="p-6">
              <Zap className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900">Lead Generation</h3>
              <p className="text-sm text-slate-500 mt-2">Identify gaps and turn them into high-converting leads.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}