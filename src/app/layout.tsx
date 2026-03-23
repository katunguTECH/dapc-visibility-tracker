"use client";
import './globals.css';
import React, { useState } from "react";
import { Loader2, ShieldCheck, TrendingUp, Zap, MapPin, Star, ChevronRight, MessageCircle, Mail, Share2 } from "lucide-react";

// LeadCard Component
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

  const getScoreColor = (score: number) => {
    if (score > 80) return "text-blue-600";
    if (score > 55) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <img src="/dapc-logo.png" alt="DAPC Logo" className="h-10 cursor-pointer" />
        <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exposure</a>
          <a href="#" className="hover:text-blue-600">Leads</a>
        </div>
        <button className="text-xs font-black uppercase bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all shadow-lg">Sign In</button>
      </nav>

      {/* HERO */}
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

        {/* FEATURES GRID */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="group p-2 text-center">
              <ShieldCheck className="text-blue-600 mb-6 mx-auto" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Local Accuracy</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior.</p>
            </div>
            <div className="group p-2 text-center">
              <TrendingUp className="text-blue-600 mb-6 mx-auto" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Discovery Rank</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">See where you actually appear when customers search for your category in Nairobi.</p>
            </div>
            <div className="group p-2 text-center">
              <Zap className="text-blue-600 mb-6 mx-auto" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Lead Strategy</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance.</p>
            </div>
          </div>
        )}

        {/* RESULTS SECTION */}
        {data && (
          <div className="space-y-12 mt-16">
            {/* Score & Rank */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-3xl border shadow-sm text-center ring-1 ring-slate-50">
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-4 block">Visibility Score</span>
                <div className={`text-7xl font-black tabular-nums leading-none mb-6 ${getScoreColor(data.score)}`}>{data.score}%</div>
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider ${data.rank.includes("#1") ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600 shadow-sm shadow-red-100"}`}>
                  <TrendingUp size={14} /> {data.rank}
                </div>
              </div>
              <div className="bg-white p-12 rounded-3xl border shadow-sm flex flex-col justify-center ring-1 ring-slate-50">
                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-6">{data.businessName}</h2>
                <div className="space-y-4 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-3"><MapPin size={18} className="text-blue-600"/> {data.address || "Nairobi, Kenya"}</div>
                  <div className="flex items-center gap-2 text-slate-900"><Star size={16} className="text-amber-400" fill="currentColor"/> Trust: {data.trust}</div>
                </div>
              </div>
            </div>

            {/* Leads */}
            <div id="leads-section" className="pt-20 border-t border-slate-100">
              <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">Growth Leads</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <LeadCard
                  icon={MessageCircle}
                  type="WhatsApp"
                  title="Direct Inquiry"
                  value="Contact DAPC Support"
                  impact="High"
                  color="bg-green-500"
                  onClick={() => window.open(`https://wa.me/254710440648?text=Hello DAPC`, "_blank")}
                />
                <LeadCard
                  icon={Mail}
                  type="Email"
                  title="Outreach Strategy"
                  value={data.leads?.email || "Email Not Detected"}
                  impact="High"
                  color="bg-blue-500"
                  onClick={() => window.location.href = `mailto:hello@dapc.co.ke?subject=Visibility Audit for ${data.businessName}`}
                />
                <LeadCard
                  icon={Share2}
                  type="Social"
                  title="Social Presence"
                  value="Gaps in FB/IG Found"
                  impact="Medium"
                  color="bg-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating WhatsApp */}
      <div
        onClick={() => window.open(`https://wa.me/254710440648?text=Hello DAPC`, "_blank")}
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:bg-green-600 transition-all flex items-center gap-2"
      >
        <MessageCircle size={28}/>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">Chat with us</span>
      </div>
    </div>
  );
}