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

const LeadCard = ({ icon: Icon, type, title, value, impact, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-8 rounded-[32px] border border-slate-100 hover:border-blue-600 hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden"
  >
    <div className="relative z-10">
      <div className={`flex items-center gap-2 mb-4`}>
        <div className={`p-2 rounded-xl ${color} text-white shadow-lg`}><Icon size={16} /></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{type}</span>
      </div>
      <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{title}</h3>
      <p className="text-slate-500 text-sm font-medium break-all">{value}</p>
      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Improve Reach →</span>
        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
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
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* PREMIUM NAV */}
      <nav className="flex justify-between items-center px-10 py-10 max-w-7xl mx-auto">
        <div className="font-black text-4xl text-blue-600 italic tracking-tighter hover:scale-105 transition-transform cursor-pointer">DAPC</div>
        <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Exposure</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Leads</a>
        </div>
        <button className="text-xs font-black uppercase bg-slate-900 text-white px-10 py-4 rounded-full hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95">
          Sign In
        </button>
      </nav>

      <main className="max-w-5xl mx-auto pt-16 pb-40 px-6">
        {/* HERO SECTION - MASSIVE SAAS TYPOGRAPHY */}
        <div className="text-center mb-16 space-y-8">
          <h1 className="text-6xl md:text-[120px] font-[1000] text-slate-900 tracking-[-0.06em] leading-[0.85] animate-in fade-in slide-in-from-top-10 duration-1000">
            Stop Guessing Your <br />
            <span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            Kenya’s first real-time market intelligence engine. Audit visibility and unlock growth gaps in seconds.
          </p>
        </div>

        {/* SEARCH BAR - ELEVATED UI */}
        <div className="bg-white p-4 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row gap-3 mb-24 hover:shadow-[0_32px_80px_-12px_rgba(37,99,235,0.15)] transition-shadow duration-700">
          <input 
            className="flex-1 px-10 py-8 rounded-[30px] outline-none text-slate-800 font-bold text-2xl placeholder:text-slate-200"
            placeholder="Search your business (e.g. Checkers Pub)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />
          <button onClick={startAudit} disabled={loading} className="bg-blue-600 text-white px-14 py-8 rounded-[30px] font-black text-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* DATA DISPLAY ENGINE */}
        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              {/* Vitals Card */}
              <div className="bg-white p-14 rounded-[60px] border border-slate-50 shadow-sm text-center flex flex-col items-center justify-center">
                <span className="text-[11px] uppercase font-black text-slate-300 tracking-[0.4em] mb-6">Visibility Score</span>
                <div className={`text-[160px] font-black tabular-nums leading-none tracking-tighter ${getScoreColor(data.score)}`}>
                  {data.score}%
                </div>
                <div className={`mt-8 inline-flex items-center gap-3 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest ${
                  data.rank.includes('#1 ') ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-600'
                }`}>
                  <TrendingUp size={16} /> {data.rank}
                </div>
              </div>

              {/* Identity Card */}
              <div className="bg-white p-14 rounded-[60px] border border-slate-50 shadow-sm flex flex-col justify-center">
                <h2 className="text-5xl font-black text-slate-900 leading-tight mb-8 tracking-tight">{data.businessName}</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 text-slate-500 font-bold text-lg">
                    <MapPin size={24} className="text-blue-600 shrink-0 mt-1"/>
                    {data.address}
                  </div>
                  <div className="flex items-center gap-3 text-lg font-black text-slate-900 tracking-tight bg-slate-50 self-start px-6 py-3 rounded-2xl">
                    <Star size={20} className="text-amber-400" fill="currentColor"/>
                    {data.trust}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Leads Section */}
            <div className="pt-20 border-t border-slate-100">
              <div className="flex items-center gap-6 mb-12">
                <div className="p-4 bg-blue-600 rounded-[20px] text-white shadow-xl shadow-blue-100"><Zap size={32} /></div>
                <h2 className="text-5xl font-[1000] text-slate-900 tracking-tight">Growth Leads</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <LeadCard 
                  icon={MessageCircle} 
                  type="Direct" 
                  title="WhatsApp Connect" 
                  value="Verify Outreach Profile" 
                  impact="Critical" 
                  color="bg-green-500"
                  onClick={() => window.open(`https://wa.me/254710440648?text=Audit Report for ${data.businessName}`, '_blank')}
                />
                <LeadCard 
                  icon={Mail} 
                  type="Email" 
                  title="Direct Strategy" 
                  value={data.leads?.email || "Scanning Mail Records..."} 
                  impact="High" 
                  color="bg-blue-500" 
                />
                <LeadCard 
                  icon={Share2} 
                  type="Social" 
                  title="Social Footprint" 
                  value="FB / IG / X Audit Pending" 
                  impact="Medium" 
                  color="bg-purple-500" 
                />
              </div>
            </div>
          </div>
        ) : (
          /* DEFAULT FEATURES GRID - RESTORED PREMIUM DESIGN */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-2xl">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-4 tracking-tight">Local Accuracy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior patterns.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-2xl">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-4 tracking-tight">Discovery Rank</h3>
              <p className="text-slate-400 font-medium leading-relaxed">See where you actually appear when customers search for your specific category in Nairobi.</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-2xl">
                <Zap size={32} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-4 tracking-tight">Lead Strategy</h3>
              <p className="text-slate-400 font-medium leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance strategies.</p>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING WHATSAPP BUTTON */}
      <div 
        onClick={() => window.open(`https://wa.me/254710440648?text=Hello DAPC!`, '_blank')}
        className="fixed bottom-10 right-10 z-50 bg-green-500 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(34,197,94,0.3)] cursor-pointer hover:scale-110 hover:bg-green-600 transition-all active:scale-90 flex items-center gap-3 group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
          Chat with us
        </span>
      </div>
    </div>
  );
}