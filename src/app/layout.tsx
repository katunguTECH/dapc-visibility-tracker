"use client";
import React, { useState } from 'react';
import { 
  Loader2, 
  AlertCircle, 
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

// Lead Card Component with the Corrected WhatsApp Routing
const LeadCard = ({ icon: Icon, type, title, value, impact, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-[24px] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group"
  >
    <div className="flex-1">
      <div className={`flex items-center gap-2 mb-3`}>
        <div className={`p-1.5 rounded-lg ${color} text-white`}><Icon size={14} /></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
      </div>
      <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
      <p className="text-slate-500 text-sm mt-2 font-medium break-all">{value}</p>
    </div>
    <div className="mt-5 border-t border-slate-50 pt-4 flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-blue-600">Click to Fix This →</span>
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
      console.error("Audit failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s: number) => {
    if (s > 80) return "text-blue-600";
    if (s > 55) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-8 max-w-6xl mx-auto">
        <div className="font-black text-3xl text-blue-600 italic tracking-tighter cursor-pointer">DAPC</div>
        <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Exposure</a>
          <a href="#" className="hover:text-blue-600">Leads</a>
        </div>
        <button className="text-xs font-black uppercase bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all">
          Sign In
        </button>
      </nav>

      <main className="max-w-4xl mx-auto pt-12 pb-32 px-6">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Stop Guessing Your <br /><span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Kenya's real-time market intelligence engine. Audit your visibility and find growth gaps in seconds.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-2 mb-20 ring-1 ring-slate-100">
          <input 
            className="flex-1 px-8 py-6 rounded-[24px] outline-none text-slate-800 font-bold text-xl placeholder:text-slate-200"
            placeholder="Search your business (e.g. Java House)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />
          <button onClick={startAudit} disabled={loading} className="bg-blue-600 text-white px-12 py-6 rounded-[24px] font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* RESULTS ENGINE */}
        {data && (
          data.score <= 11 ? (
            <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center animate-in fade-in zoom-in">
              <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-black text-slate-900">Identity Not Found</h3>
              <p className="text-slate-500 mt-2">Check the spelling for "{query}" or add your city (e.g. "{query} Nairobi").</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-12 rounded-[48px] border shadow-sm text-center ring-1 ring-slate-50">
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-4 block">Visibility Score</span>
                  <div className={`text-9xl font-black tabular-nums leading-none mb-6 ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </div>
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                    data.rank.includes('#1 ') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-600 shadow-sm shadow-red-100'
                  }`}>
                    <TrendingUp size={14} /> {data.rank}
                  </div>
                </div>

                <div className="bg-white p-12 rounded-[48px] border shadow-sm flex flex-col justify-center ring-1 ring-slate-50">
                  <h2 className="text-4xl font-black text-slate-900 leading-[1.1] mb-6">{data.businessName}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-slate-500 font-bold text-sm">
                      <MapPin size={18} className="text-blue-600 shrink-0"/>
                      {data.address || "Nairobi, Kenya"}
                    </div>
                    <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Star size={16} className="text-amber-400" fill="currentColor"/>
                      Trust Rating: {data.trust}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => document.getElementById('leads-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-8 bg-slate-900 text-white rounded-[32px] font-black text-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group shadow-xl"
              >
                🚀 Find Growth Gaps for {data.businessName} 
                <ChevronRight className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div id="leads-section" className="pt-20 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100"><Zap size={28} /></div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Growth Leads</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LeadCard 
                    icon={MessageCircle} 
                    type="WhatsApp" 
                    title="Direct Inquiry" 
                    value="Contact DAPC Support" 
                    impact="High" 
                    color="bg-green-500"
                    onClick={() => {
                      const msg = encodeURIComponent(`Hello DAPC! I audited "${data.businessName}" and it scored ${data.score}%. I want to improve our rank (${data.rank}).`);
                      window.open(`https://wa.me/254710440648?text=${msg}`, '_blank');
                    }}
                  />
                  <LeadCard 
                    icon={Mail} 
                    type="Email" 
                    title="Outreach Strategy" 
                    value={data.leads?.email || "Email Not Detected"} 
                    impact="High" 
                    color="bg-blue-500" 
                    onClick={() => {
                      window.location.href = `mailto:hello@dapc.co.ke?subject=Visibility Audit for ${data.businessName}`;
                    }}
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
          )
        )}

        {/* FEATURES GRID (Visible when no data) */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="group p-2">
              <ShieldCheck className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Local Accuracy</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior.</p>
            </div>
            <div className="group p-2">
              <TrendingUp className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Discovery Rank</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">See where you actually appear when customers search for your category in Nairobi.</p>
            </div>
            <div className="group p-2">
              <Zap className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Lead Strategy</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance.</p>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <div 
        onClick={() => {
          const msg = encodeURIComponent("Hello DAPC! I have a question about the Visibility Tracker.");
          window.open(`https://wa.me/254710440648?text=${msg}`, '_blank');
        }}
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:bg-green-600 transition-all flex items-center gap-2 group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
          Chat with us
        </span>
      </div>
    </div>
  );
}