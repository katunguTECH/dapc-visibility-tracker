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
      {/* RESTORED BRAND NAV */}
      <nav className="flex justify-between items-center px-8 py-10 max-w-7xl mx-auto">
        <div className="font-[1000] text-4xl text-blue-600 italic tracking-tighter leading-none">DAPC</div>
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
        {/* RESTORED MASSIVE SAAS TYPOGRAPHY */}
        <div className="text-center mb-16">
          <h1 
            style={{ letterSpacing: '-0.07em', lineHeight: '0.85', fontWeight: 1000 }}
            className="text-6xl md:text-[120px] text-slate-900 mb-8"
          >
            Stop Guessing Your <br />
            <span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium">
            Kenya's real-time market intelligence engine. Audit your visibility and find growth gaps in seconds.
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
          <button onClick={startAudit} disabled={loading} className="bg-blue-600 text-white px-12 py-6 rounded-[24px] font-[1000] text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100">
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* PERMANENT FEATURES GRID (Visible when no data) */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="group">
              <ShieldCheck className="text-blue-600 mb-6" size={40} />
              <h3 className="font-[1000] text-slate-900 text-2xl mb-3 tracking-tight">Local Accuracy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior.</p>
            </div>
            <div className="group">
              <TrendingUp className="text-blue-600 mb-6" size={40} />
              <h3 className="font-[1000] text-slate-900 text-2xl mb-3 tracking-tight">Discovery Rank</h3>
              <p className="text-slate-400 font-medium leading-relaxed">See where you actually appear when customers search for your category in Nairobi.</p>
            </div>
            <div className="group">
              <Zap className="text-blue-600 mb-6" size={40} />
              <h3 className="font-[1000] text-slate-900 text-2xl mb-3 tracking-tight">Lead Strategy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance.</p>
            </div>
          </div>
        )}

        {/* RESULTS ENGINE */}
        {data && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-14 rounded-[48px] border border-slate-100 shadow-sm text-center">
                <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.3em] mb-4 block">Visibility Score</span>
                <div style={{ letterSpacing: '-0.05em', fontWeight: 1000 }} className={`text-[150px] leading-none mb-6 ${data.score > 55 ? 'text-blue-600' : 'text-red-500'}`}>
                  {data.score}%
                </div>
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50">
                  <TrendingUp size={14} /> {data.rank}
                </div>
              </div>
              <div className="bg-white p-14 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-center">
                <h2 className="text-5xl font-[1000] text-slate-900 leading-tight mb-8 tracking-tighter">{data.businessName}</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-slate-500 font-bold">
                    <MapPin size={20} className="text-blue-600 shrink-0"/>
                    {data.address}
                  </div>
                  <div className="inline-flex items-center gap-2 font-black text-slate-900 bg-slate-50 px-5 py-2 rounded-xl">
                    <Star size={16} className="text-amber-400" fill="currentColor"/>
                    {data.trust}
                  </div>
                </div>
              </div>
            </div>

            {/* Leads Section */}
            <div className="pt-20 border-t border-slate-100">
              <h2 className="text-4xl font-[1000] text-slate-900 mb-10">Growth Leads</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div onClick={() => window.open(`https://wa.me/254710440648?text=Audit for ${data.businessName}`, '_blank')} className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-green-500 transition-all cursor-pointer">
                    <div className="p-3 bg-green-500 text-white rounded-xl inline-block mb-4"><MessageCircle size={20}/></div>
                    <h4 className="font-black text-xl mb-1">WhatsApp</h4>
                    <p className="text-slate-400 text-sm font-medium">Verify Outreach Profile</p>
                 </div>
                 <div className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-blue-500 transition-all cursor-pointer">
                    <div className="p-3 bg-blue-500 text-white rounded-xl inline-block mb-4"><Mail size={20}/></div>
                    <h4 className="font-black text-xl mb-1">Email Strategy</h4>
                    <p className="text-slate-400 text-sm font-medium">{data.leads?.email || "Scanning..."}</p>
                 </div>
                 <div className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-purple-500 transition-all cursor-pointer">
                    <div className="p-3 bg-purple-500 text-white rounded-xl inline-block mb-4"><Share2 size={20}/></div>
                    <h4 className="font-black text-xl mb-1">Social Presence</h4>
                    <p className="text-slate-400 text-sm font-medium">Gaps in FB/IG Found</p>
                 </div>
              </div>
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