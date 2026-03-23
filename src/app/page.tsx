"use client";
import React, { useState } from 'react';
import { 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Star, 
  ChevronRight, 
  MessageCircle, 
  Mail, 
  Share2 
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-7xl mx-auto">
        <div style={{ fontWeight: 1000, fontStyle: 'italic', letterSpacing: '-0.05em' }} className="text-4xl text-blue-600 leading-none">
          DAPC
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exposure</a>
          <a href="#" className="hover:text-blue-600">Leads</a>
        </div>
        <button className="text-[10px] font-black uppercase bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-all">
          Sign In
        </button>
      </nav>

      <main className="max-w-6xl mx-auto pt-12 pb-32 px-6">
        {/* HERO SECTION - FORCED SAAS TYPOGRAPHY */}
        <div className="text-center mb-16">
          <h1 
            style={{ letterSpacing: '-0.07em', lineHeight: '0.85', fontWeight: 1000 }}
            className="text-6xl md:text-[120px] text-slate-900 mb-8"
          >
            Stop Guessing Your <br />
            <span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
            Kenya's real-time market intelligence engine. Audit your visibility and find growth gaps in seconds. [cite: 8]
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mb-24">
          <input 
            className="flex-1 px-8 py-6 rounded-[24px] outline-none text-slate-800 font-bold text-2xl placeholder:text-slate-200"
            placeholder="Search your business (e.g. Java House)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={startAudit} disabled={loading} className="bg-blue-600 text-white px-12 py-6 rounded-[24px] font-black text-xl hover:bg-blue-700 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* FEATURES GRID - PERMANENTLY STYLED */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="group">
              <ShieldCheck className="text-blue-600 mb-6" size={40} />
              <h3 style={{ fontWeight: 1000 }} className="text-slate-900 text-2xl mb-3 tracking-tight">Local Accuracy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior. [cite: 11]</p>
            </div>
            <div className="group">
              <TrendingUp className="text-blue-600 mb-6" size={40} />
              <h3 style={{ fontWeight: 1000 }} className="text-slate-900 text-2xl mb-3 tracking-tight">Discovery Rank</h3>
              <p className="text-slate-400 font-medium leading-relaxed">See where you actually appear when customers search for your category in Nairobi. [cite: 13]</p>
            </div>
            <div className="group">
              <Zap className="text-blue-600 mb-6" size={40} />
              <h3 style={{ fontWeight: 1000 }} className="text-slate-900 text-2xl mb-3 tracking-tight">Lead Strategy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance. [cite: 15]</p>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING CONTACT */}
      <div 
        onClick={() => window.open('https://wa.me/254710440648', '_blank')}
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white px-6 py-4 rounded-full shadow-2xl cursor-pointer flex items-center gap-3"
      >
        <MessageCircle size={24} />
        <span className="font-black uppercase tracking-widest text-[10px]">Chat with us</span>
      </div>
    </div>
  );
}