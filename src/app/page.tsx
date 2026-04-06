"use client";
import { useState, useEffect } from "react";
import { UserButton, useSignIn, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon, ArrowRight } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/icons/starter-cheetah.jpg", price: "1,999", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/icons/boost-buffalo.jpg", price: "3,999", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/icons/growthengine-rhino.jpg", price: "5,999", features: ["Web visibility boost", "WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/icons/marketleader-elephant.jpg", price: "7,999", features: ["AI search optimization", "Competitor comparisons", "Advanced tracking"] },
  { name: "Super Active", icon: "/icons/superactivevisibility-lion.jpg", price: "10,000", features: ["Global optimization", "Priority support", "Monthly insights"] },
];

export default function LandingPage() {
  const [businessName, setBusinessName] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const { openSignIn } = useSignIn();
  const { isSignedIn } = useUser();
  const [stats, setStats] = useState({ score: "--", rank: "--", leads: "--" });

  useEffect(() => {
    const savedCount = localStorage.getItem("dapc_search_count");
    if (savedCount) setSearchCount(parseInt(savedCount));
  }, []);

  const handleAudit = () => {
    if (!businessName.trim()) return alert("Please enter a business name");

    // If they've already used their free search and aren't signed in
    if (searchCount >= 1 && !isSignedIn) {
      alert("You've used your free audit! Please sign in to see more results.");
      openSignIn?.({});
      return;
    }

    // Simulate audit data
    setStats({ score: "38", rank: "#21", leads: "90" });
    
    // Update count only if not signed in (to track the freebie)
    if (!isSignedIn) {
      const newCount = searchCount + 1;
      setSearchCount(newCount);
      localStorage.setItem("dapc_search_count", newCount.toString());
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-8">
          <SignedOut>
            <button onClick={() => openSignIn?.({})} className="text-sm font-bold text-slate-500 hover:text-blue-700">Login</button>
            <button onClick={() => openSignIn?.({})} className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-black shadow-lg">Get Started</button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 inline-block">Kenya Market Intelligence</div>
          <h1 className="text-6xl font-black leading-[1.1] tracking-tight">Is Your Business <br /> <span className="text-blue-700">Visible Online?</span></h1>
          <div className="flex gap-3 p-2.5 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg">
            <input 
              className="flex-1 px-4 outline-none text-lg font-medium" 
              placeholder="Enter business name..." 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <button onClick={handleAudit} className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2">Audit <ArrowRight size={18} /></button>
          </div>
          <p className="text-xs text-slate-400 font-bold italic">
            {!isSignedIn && searchCount === 0 ? "You have 1 free search remaining" : ""}
          </p>
        </div>

        <div className="bg-slate-50 rounded-[2.5rem] p-8 grid grid-cols-2 gap-4 border border-slate-100 shadow-inner">
          <div className="col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xl text-center">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Visibility Score</p>
            <div className="text-5xl font-black text-red-400">{stats.score}<span className="text-lg font-bold opacity-30">/100</span></div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400">Rank</p><p className="font-black text-2xl">{stats.rank}</p></div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center"><p className="text-[10px] font-black text-slate-400">Missed Leads</p><p className="font-black text-2xl">{stats.leads}</p></div>
        </div>
      </header>

      <section className="bg-slate-50 py-32 px-10">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-20">Choose Your Growth Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-200 flex flex-col items-center hover:shadow-2xl transition-all">
                <img src={plan.icon} alt={plan.name} className="w-16 h-16 mb-6 rounded-full object-cover border" />
                <h3 className="text-[11px] font-black uppercase mb-4">{plan.name}</h3>
                <p className="text-xl font-black text-blue-700 mb-8">KES {plan.price}</p>
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}