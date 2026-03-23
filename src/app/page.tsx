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

// Optimized Lead Card Component
const LeadCard = ({ icon: Icon, type, title, value, impact, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="group bg-white p-6 rounded-[24px] border border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className={`flex items-center gap-2 mb-3`}>
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {type}
          </span>
        </div>
        <h3 className="text-lg font-black text-slate-900 leading-tight">{title}</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium break-all">{value}</p>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-slate-50 pt-4">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase">Impact: {impact}</span>
      </div>
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

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* NAVIGATION BAR - RESTORED BRANDING */}
      <nav className="flex justify-between items-center px-8 py-8 max-w-6xl mx-auto">
        <div className="font-black text-3xl tracking-tighter text-blue-600 italic">DAPC</div>
        <div className="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Exposure</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Leads</a>
        </div>
        <button className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
          Sign In
        </button>
      </nav>

      <main className="max-w-4xl mx-auto pt-12 pb-32 px-6">
        {/* HERO SECTION - RESTORED MASSIVE TYPOGRAPHY */}
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
            Stop Guessing Your <br />
            <span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Get real-time Kenyan market intelligence. Audit your business visibility across Google, Social Media, and local directories in seconds.
          </p>
        </div>

        {/* MAIN SEARCH INTERFACE */}
        <div className="bg-white p-3 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-2 mb-20 ring-1 ring-slate-100">
          <input 
            className="flex-1 px-8 py-6 rounded-[24px] outline-none text-slate-800 font-bold text-xl placeholder:text-slate-300"
            placeholder="Search your business (e.g. Java House)..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />
          <button 
            onClick={startAudit} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-[24px] font-black text-xl flex items-center justify-center transition-all active:scale-95 shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Visibility Audit"}
          </button>
        </div>

        {/* RESULTS ENGINE */}
        {data && (
          data.score <= 11 ? (
            <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center animate-in fade-in zoom-in duration-500">
              <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-black text-slate-900">Identity Not Found</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">We couldn't verify a business matching "{query}" in our Kenyan directory.</p>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score Card */}
                <div className="bg-white p-12 rounded-[48px] border border-slate-50 shadow-sm text-center ring-1 ring-slate-50">
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-[0.3em] mb-4 block">Visibility Score</span>
                  <div className="text-9xl font-black text-blue-600 tracking-tighter tabular-nums leading-none mb-6">{data.score}%</div>
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider">
                    <TrendingUp size={14} /> {data.rank}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white p-12 rounded-[48px] border border-slate-50 shadow-sm flex flex-col justify-center ring-1 ring-slate-50">
                  <h2 className="text-4xl font-black text-slate-900 leading-[1.1] mb-6">{data.businessName}</h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-3 text-slate-500">
                      <MapPin className="shrink-0 text-blue-600 mt-1" size={18} />
                      <p className="text-sm font-bold leading-relaxed">{data.address || "Nairobi, Kenya"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                      <span className="text-sm font-black text-slate-900 tracking-tight">Trust Rating: {data.trust || "Verified"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LEADS SECTION */}
              <div id="leads-section" className="pt-20 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100"><Zap className="text-white" size={28} /></div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Growth Leads</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <LeadCard 
                      icon={MessageCircle}
                      type="Direct" 
                      title="WhatsApp & Mobile" 
                      value={data.leads?.phone || "07XX XXX XXX"}
                      impact="High"
                      color="bg-green-500"
                      onClick={() => window.open(`https://wa.me/254710440648?text=Audit for ${data.businessName}`, '_blank')}
                   />
                   <LeadCard 
                      icon={Mail}
                      type="Email" 
                      title="Direct Outreach" 
                      value={data.leads?.email || "Not Found"}
                      impact="High"
                      color="bg-blue-500"
                   />
                   <LeadCard 
                      icon={Share2}
                      type="Social" 
                      title="Social Footprint" 
                      value={`FB: ${data.leads?.facebook || '---'} | IG: ${data.leads?.instagram || '---'}`}
                      impact="Medium"
                      color="bg-purple-500"
                   />
                </div>
              </div>
            </div>
          )
        )}

        {/* DEFAULT FEATURES - RESTORED ORIGINAL STYLING */}
        {!data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            <div className="group">
              <ShieldCheck className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Local Accuracy</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Tailored specifically for the unique Kenyan business landscape and search habits.</p>
            </div>
            <div className="group">
              <TrendingUp className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Market Rank</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">See how you stack up against the biggest players in your city and category.</p>
            </div>
            <div className="group">
              <Zap className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-slate-900 text-xl mb-3">Lead Gen</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">Identify specific digital gaps and turn them into high-converting sales leads.</p>
            </div>
          </div>
        )}
      </main>

      {/* FLOATING CHAT BUTTON */}
      <div 
        onClick={() => window.open('https://wa.me/254710440648', '_blank')}
        className="fixed bottom-10 right-10 z-50 bg-green-500 text-white p-5 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-all flex items-center gap-3 group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
          Chat with us
        </span>
      </div>
    </div>
  );
}