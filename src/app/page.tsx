"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("")

  useEffect(() => {
    let interval: any;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev >= 95 ? 95 : prev + 5;
          if (next < 30) setStatus("Connecting to Kenyan Search Clusters...");
          else if (next < 65) setStatus(`Auditing "${business}" SEO Rank...`);
          else setStatus("Fetching Live Trust Ratings...");
          return next;
        });
      }, 150);
    } else {
      if (progress > 0) setProgress(100);
      const timeout = setTimeout(() => { setProgress(0); setStatus(""); }, 1000);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [loading, business]);

  async function handleAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!business || !location) return;
    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: business, location })
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Check your API keys in .env");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* SaaS Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.6)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto pt-24 px-6">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            DAPC Visibility <span className="text-blue-600">Audit</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Real-time Kenyan market intelligence. Identify your digital footprint gaps in seconds.
          </p>
          <div className="h-8 mt-6">
            {loading && <p className="text-blue-600 font-bold animate-pulse uppercase tracking-widest text-sm">{status}</p>}
          </div>
        </div>

        {/* Search Bar - SaaS Look */}
        <form onSubmit={handleAudit} className="max-w-4xl mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-4 mb-20 relative z-10">
          <input 
            className="flex-1 p-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 text-lg"
            placeholder="Business Name (e.g. Safaricom)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
          <input 
            className="flex-1 p-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-600 text-lg"
            placeholder="Location (e.g. Nairobi)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:bg-slate-300">
            {loading ? "Analyzing..." : "Run Audit"}
          </button>
        </form>

        {/* Results Dashboard */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Visibility Score</span>
              <div className="text-8xl font-black text-blue-600 mt-4 tracking-tighter">{data.visibilityScore}%</div>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Google Rank</span>
              <div className="text-8xl font-black text-slate-900 mt-4 tracking-tighter">{data.ranking}</div>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trust Rating</span>
              <div className="text-8xl font-black text-yellow-500 mt-4 tracking-tighter">{data.rating}</div>
              <p className="text-slate-400 text-sm mt-4 font-bold uppercase tracking-widest">{data.reviews} Google Reviews</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}