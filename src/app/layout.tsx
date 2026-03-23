// layout.tsx
"use client";
import './globals.css'; // <-- THIS IS REQUIRED

import React, { useState } from 'react';
import { Loader2, ShieldCheck, TrendingUp, Zap, MapPin, Star, ChevronRight, MessageCircle, Mail, Share2 } from 'lucide-react';

const LeadCard = ({ icon: Icon, type, title, value, impact, color, onClick }: any) => (
  <div onClick={onClick} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${color} text-white`}><Icon size={16} /></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 font-medium break-all">{value}</p>
    </div>
    <div className="mt-5 border-t border-slate-50 pt-4 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-600">Impact: {impact}</span>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
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
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s: number) => s > 80 ? "text-blue-600" : s > 55 ? "text-amber-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <img src="/dapc-logo.png" alt="DAPC Logo" className="h-10 cursor-pointer" /> {/* <- Add logo here */}
        <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exposure</a>
          <a href="#" className="hover:text-blue-600">Leads</a>
        </div>
        <button className="text-xs font-black uppercase bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all shadow-lg">
          Sign In
        </button>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto pt-16 pb-32 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
          Stop Guessing Your <span className="text-blue-600 italic">Digital Impact.</span>
        </h1>
        <p className="text-lg text-slate-500 mb-12 max-w-3xl mx-auto">
          Kenya's real-time market intelligence engine. Audit your visibility and find growth gaps in seconds.
        </p>

        {/* SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 md:p-6 rounded-3xl shadow-2xl border border-slate-100">
          <input
            type="text"
            placeholder="Search your business (e.g. Java House)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startAudit()}
            className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 outline-none font-bold text-slate-900 placeholder:text-slate-300 text-lg"
          />
          <button
            onClick={startAudit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <div
        onClick={() => window.open(`https://wa.me/254710440648?text=Hello DAPC!`, "_blank")}
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:bg-green-600 transition-all flex items-center gap-2"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Chat with us
        </span>
      </div>
    </div>
  );
}