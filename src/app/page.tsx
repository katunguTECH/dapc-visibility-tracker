"use client";
import React, { useState } from 'react';
import { 
  Loader2, AlertCircle, ShieldCheck, TrendingUp, Zap, MapPin, Star, ChevronRight, MessageCircle, Mail, Share2
} from 'lucide-react';

const LeadCard = ({ icon: Icon, type, title, value, impact, color }: any) => (
  <div className="bg-white p-6 rounded-[24px] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
    <div className="flex-1">
      <div className={`flex items-center gap-2 mb-3`}>
        <div className={`p-1.5 rounded-lg ${color} text-white`}><Icon size={14} /></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 font-medium">{value}</p>
    </div>
    <div className="mt-5 border-t border-slate-50 pt-4 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase">Impact: {impact}</span>
      <ChevronRight size={16} className="text-slate-300" />
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
    const res = await fetch(`/api/audit?business=${encodeURIComponent(query)}`);
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  const getScoreColor = (s: number) => {
    if (s > 80) return "text-blue-600";
    if (s > 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="flex justify-between items-center px-8 py-8 max-w-6xl mx-auto">
        <div className="font-black text-3xl text-blue-600 italic tracking-tighter">DAPC</div>
        <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#">Home</a><a href="#">Exposure</a><a href="#">Leads</a>
        </div>
        <button className="text-xs font-black uppercase bg-slate-900 text-white px-8 py-3 rounded-full">Sign In</button>
      </nav>

      <main className="max-w-4xl mx-auto pt-12 pb-32 px-6">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Stop Guessing Your <br /><span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Get real-time Kenyan market intelligence and visibility auditing.</p>
        </div>

        <div className="bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mb-20 ring-1 ring-slate-100">
          <input 
            className="flex-1 px-8 py-6 rounded-[24px] outline-none text-slate-800 font-bold text-xl placeholder:text-slate-200"
            placeholder="Search your business (e.g. Java House)..."
            value={query} onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={startAudit} className="bg-blue-600 text-white px-12 py-6 rounded-[24px] font-black text-xl hover:bg-blue-700 transition-all">
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {data && (
          data.score <= 11 ? (
            <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center animate-in fade-in zoom-in">
              <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-black text-slate-900">Identity Not Found</h3>
              <p className="text-slate-500 mt-2">Please check the spelling for "{query}".</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-12 rounded-[48px] border shadow-sm text-center">
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-4 block">Visibility Score</span>
                  <div className={`text-9xl font-black tabular-nums leading-none mb-6 ${getScoreColor(data.score)}`}>{data.score}%</div>
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-50 text-slate-600 rounded-full text-xs font-black uppercase tracking-wider">
                    <TrendingUp size={14} className={data.score < 60 ? "text-red-500" : "text-green-500"} /> {data.rank}
                  </div>
                </div>
                <div className="bg-white p-12 rounded-[48px] border shadow-sm flex flex-col justify-center">
                  <h2 className="text-4xl font-black text-slate-900 leading-[1.1] mb-6">{data.businessName}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-500 font-bold text-sm"><MapPin size={18} className="text-blue-600"/>{data.address}</div>
                    <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2"><Star size={16} className="text-amber-400" fill="currentColor"/>Trust: {data.trust}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-8 bg-slate-900 text-white rounded-[32px] font-black text-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group shadow-xl"
              >
                🚀 Find Leads for {data.businessName} <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div id="leads-section" className="pt-20 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-10"><div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Zap size={28} /></div><h2 className="text-4xl font-black text-slate-900 tracking-tight">Growth Leads</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LeadCard icon={MessageCircle} type="Direct" title="WhatsApp & Mobile" value={data.leads.whatsapp} impact="High" color="bg-green-500" />
                  <LeadCard icon={Mail} type="Email" title="Direct Outreach" value={data.leads.email} impact="High" color="bg-blue-500" />
                  <LeadCard icon={Share2} type="Social" title="Social Footprint" value="Scan FB / IG / X" impact="Medium" color="bg-purple-500" />
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}