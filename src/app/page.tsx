"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Star,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

// Sub-component for individual Lead Cards
const LeadCard = ({ op }: { op: any }) => (
  <div className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase tracking-wider">
          {op.type}
        </span>
        <h3 className="text-lg font-bold text-slate-900 mt-2">{op.title}</h3>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">{op.description}</p>
      </div>
      <div className="bg-slate-50 text-slate-400 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <ChevronRight size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 border-t pt-4 border-slate-50">
      <span className="text-[10px] font-bold text-slate-400 uppercase">Impact:</span>
      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
        {op.impact} Priority
      </span>
    </div>
  </div>
);

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
      console.error("Audit failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* NAVIGATION BAR */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="font-black text-2xl tracking-tighter text-blue-600 italic">DAPC</div>
        <div className="hidden md:flex gap-10 text-sm font-bold text-slate-500">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Exposure</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Leads</a>
        </div>
        <button className="text-sm font-bold bg-white border border-slate-200 px-6 py-2.5 rounded-full shadow-sm hover:bg-slate-50 transition-all active:scale-95">
          Sign In
        </button>
      </nav>

      <main className="max-w-4xl mx-auto pt-12 pb-32 px-6">
        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Stop Guessing Your <br />
            <span className="text-blue-600">Digital Impact.</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Get real-time Kenyan market intelligence. Audit your business visibility across Google, Social Media, and local directories in seconds.
          </p>
        </div>

        {/* MAIN SEARCH INTERFACE */}
        <div className="bg-white p-3 rounded-[32px] shadow-[0_20px_50px_rgba(37,99,235,0.1)] border border-blue-50 flex flex-col md:flex-row gap-2 mb-16 ring-8 ring-blue-50/50">
          <input 
            className="flex-1 px-8 py-5 rounded-[24px] outline-none text-slate-800 font-bold text-lg placeholder:text-slate-300"
            placeholder="Search your business (e.g. Java House)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />
          <button 
            onClick={startAudit} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[24px] font-black text-lg flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* RESULTS ENGINE */}
        {data && (
          data.score <= 11 ? (
            /* GIBBERISH / NOT FOUND STATE */
            <div className="bg-white p-10 rounded-[32px] border-2 border-dashed border-slate-200 text-center animate-in fade-in zoom-in duration-500">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Identity Not Found</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                We couldn't verify a business matching "{query}" in our Kenyan directory. Please check the spelling.
              </p>
            </div>
          ) : (
            /* SUCCESSFUL AUDIT DASHBOARD */
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Card */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2">Visibility Score</span>
                  <div className="text-8xl font-black text-blue-600 tabular-nums">{data.score}%</div>
                  <div className="mt-6 inline-flex items-center gap-2 self-center px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider">
                    <TrendingUp size={14} /> {data.rank}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center">
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">{data.businessName}</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 text-slate-500">
                      <MapPin className="shrink-0 text-blue-600" size={18} />
                      <p className="text-sm font-bold leading-relaxed">{data.address || "Nairobi, Kenya"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                      <span className="text-sm font-black text-slate-900">Trust: {data.trust || "Verified"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <button 
                onClick={() => document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-xl hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
              >
                🚀 Find Leads for {data.businessName} 
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* LEADS SECTION ANCHOR */}
              <div id="leads-section" className="pt-16 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-amber-100 rounded-lg"><Lightbulb className="text-amber-600" size={24} /></div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Growth Leads</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <LeadCard op={{
                     type: "Reputation", 
                     title: "Review Velocity", 
                     description: "Your trust rating is below the category average. You need ~12 new positive reviews to hit the Top 3.",
                     impact: "High"
                   }} />
                   <LeadCard op={{
                     type: "SEO", 
                     title: "Directory Sync", 
                     description: "We found inconsistencies in your NAP (Name, Address, Phone) data across 3 Kenyan directories.",
                     impact: "Medium"
                   }} />
                </div>
              </div>
            </div>
          )
        )}

        {/* DEFAULT FEATURE CARDS (ONLY SHOW WHEN NO DATA) */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Local Accuracy</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">Tailored specifically for the unique Kenyan business landscape and search habits.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <TrendingUp />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Competitor Insights</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">See how you stack up against the biggest players in your city and category.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Zap />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Lead Generation</h3>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">Identify specific digital gaps and turn them into high-converting sales leads.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}