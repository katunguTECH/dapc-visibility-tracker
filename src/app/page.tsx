"use client";
import React, { useState } from 'react';
import { 
  Loader2, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MapPin, 
  ChevronRight,
  MessageCircle,
  Mail,
  Share2
} from 'lucide-react';

const LeadCard = ({ icon: Icon, type, title, value, impact, color, onClick }: any) => (
  <div 
    onClick={onClick}
    className="group bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {type}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium break-all">{value}</p>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between border-t pt-4">
      <span className="text-[10px] font-bold text-slate-400 uppercase">
        Impact: {impact}
      </span>
      <ChevronRight className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">

      {/* NAV */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="text-3xl font-black italic text-blue-600 tracking-tight">
          DAPC
        </div>

        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
          <a href="#">Home</a>
          <a href="#">Exposure</a>
          <a href="#">Leads</a>
        </div>

        <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-blue-600 transition">
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <main className="max-w-5xl mx-auto px-6 pt-16 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
          Stop Guessing Your <br />
          <span className="text-blue-600">Digital Impact</span>
        </h1>

        <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto">
          Kenya’s real-time market intelligence engine. Audit your visibility and uncover growth gaps in seconds.
        </p>

        {/* SEARCH BOX */}
        <div className="mt-12 bg-white/80 backdrop-blur-xl p-3 rounded-2xl shadow-xl border flex flex-col md:flex-row gap-2">
          <input 
            className="flex-1 px-6 py-4 rounded-xl outline-none text-lg font-semibold placeholder:text-slate-300"
            placeholder="Search your business (e.g. Java House)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startAudit()}
          />

          <button 
            onClick={startAudit}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Run Audit"}
          </button>
        </div>

        {/* TRUST TEXT */}
        <p className="mt-4 text-xs text-slate-400">
          Nairobi-focused insights • Built for Kenyan businesses
        </p>

        {/* FEATURES */}
        {!data && (
          <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <ShieldCheck className="text-blue-600 mb-4" />
              <h3 className="font-bold text-lg">Local Accuracy</h3>
              <p className="text-sm text-slate-500 mt-2">
                Built for the Kenyan search ecosystem and real customer behavior.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <TrendingUp className="text-blue-600 mb-4" />
              <h3 className="font-bold text-lg">Discovery Rank</h3>
              <p className="text-sm text-slate-500 mt-2">
                See where you actually appear in Nairobi search results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <Zap className="text-blue-600 mb-4" />
              <h3 className="font-bold text-lg">Lead Strategy</h3>
              <p className="text-sm text-slate-500 mt-2">
                Turn visibility gaps into real customers and revenue.
              </p>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {data && (
          <div className="mt-20 space-y-12 text-left">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-3xl shadow">
                <p className="text-xs text-slate-400 uppercase">Visibility Score</p>
                <h2 className="text-7xl font-black text-blue-600">
                  {data.score}%
                </h2>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow">
                <h2 className="text-3xl font-black">{data.businessName}</h2>
                <div className="flex items-center gap-2 mt-4 text-slate-500">
                  <MapPin size={16} />
                  {data.address || "Nairobi, Kenya"}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-6">Growth Leads</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <LeadCard 
                  icon={MessageCircle}
                  type="Direct"
                  title="WhatsApp"
                  value={data.leads?.phone || "Not Found"}
                  impact="High"
                  color="bg-green-500"
                  onClick={() => window.open(`https://wa.me/254710440648`, '_blank')}
                />

                <LeadCard 
                  icon={Mail}
                  type="Email"
                  title="Email Outreach"
                  value={data.leads?.email || "Not Found"}
                  impact="High"
                  color="bg-blue-500"
                />

                <LeadCard 
                  icon={Share2}
                  type="Social"
                  title="Social Gaps"
                  value="Optimization Needed"
                  impact="Medium"
                  color="bg-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* WHATSAPP FLOAT */}
      <div 
        onClick={() => window.open('https://wa.me/254710440648', '_blank')}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl cursor-pointer hover:scale-110 transition"
      >
        <MessageCircle />
      </div>

    </div>
  );
}