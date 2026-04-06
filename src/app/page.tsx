"use client";
import { useState, useEffect } from "react";
import { UserButton, useSignIn, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search, ArrowRight, MapPin, Share2, Users, Globe, X } from "lucide-react";
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
  const [isAuditing, setIsAuditing] = useState(false);
  const { openSignIn } = useSignIn();
  const { isSignedIn } = useUser();
  
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const savedCount = localStorage.getItem("dapc_search_count");
    if (savedCount) setSearchCount(parseInt(savedCount));
  }, []);

  const handleAudit = () => {
    if (!businessName.trim()) return;

    if (searchCount >= 1 && !isSignedIn) {
      openSignIn?.({});
      return;
    }

    setIsAuditing(true);
    
    // Simulate data fetching delay
    setTimeout(() => {
      setReport({
        score: 38,
        googleMaps: "Unoptimized (Missing NAP)",
        socials: { fb: "Found", tiktok: "Missing", x: "Missing" },
        seo: "Critical (No Meta Description)",
        competitors: [
          { name: "Competitor A", score: 72 },
          { name: "Competitor B", score: 65 }
        ]
      });
      setIsAuditing(false);
      
      if (!isSignedIn) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem("dapc_search_count", newCount.toString());
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-6">
          <SignedOut>
            <button onClick={() => openSignIn?.({})} className="text-sm font-bold text-slate-500">Login</button>
            <button onClick={() => openSignIn?.({})} className="bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-black shadow-md">Get Started</button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tight mb-6">Digital Footprint <span className="text-blue-700">Intelligence</span></h1>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Instant audit of your Google Maps, Social Media, and SEO visibility in the Kenyan market.</p>
        </div>

        <div className="flex gap-3 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl mx-auto mb-16">
            <input 
              className="flex-1 px-4 outline-none text-lg font-bold" 
              placeholder="Enter Business Name (e.g. Langata Hospital)" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <button 
              onClick={handleAudit}
              disabled={isAuditing}
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-black transition disabled:opacity-50"
            >
              {isAuditing ? "Analyzing..." : "Run Audit"} <ArrowRight size={18} />
            </button>
        </div>

        {report && (
          <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Visibility Score Card */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-8 flex flex-col justify-center items-center shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Visibility Score</p>
              <div className="text-7xl font-black text-red-400">{report.score}<span className="text-2xl opacity-30">/100</span></div>
              <p className="text-xs font-bold text-yellow-400 mt-4 text-center px-4">Action Required: Your business is invisible to 60% of local searches.</p>
            </div>

            {/* Presence Audit Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-700 rounded-lg"><MapPin size={20}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Google Maps</p>
                    <p className="font-bold text-sm">{report.googleMaps}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-50 text-purple-700 rounded-lg"><Share2 size={20}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Social Signals</p>
                    <div className="flex gap-2 mt-1">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${report.socials.fb === 'Found' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>FB</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${report.socials.tiktok === 'Found' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>TikTok</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${report.socials.x === 'Found' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>X</span>
                    </div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-orange-50 text-orange-700 rounded-lg"><Globe size={20}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">SEO Health</p>
                    <p className="font-bold text-sm text-red-500">{report.seo}</p>
                 </div>
               </div>
            </div>

            {/* Competitor Comparison Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2"><Users size={14}/> Competitor Gap</p>
               <div className="space-y-5">
                 {report.competitors.map((comp: any, i: number) => (
                   <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{comp.name}</span>
                        <span>{comp.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-700 h-full transition-all duration-1000" style={{ width: `${comp.score}%` }}></div>
                      </div>
                   </div>
                 ))}
               </div>
               <p className="text-[10px] font-medium text-slate-400 mt-6 italic">*Competitors are outranking you in "Near Me" searches.</p>
            </div>
          </div>
        )}
      </header>

      {/* Pricing and Other sections remain the same */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-16 uppercase tracking-tighter">Choose Your Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-200 flex flex-col items-center hover:border-blue-700 transition-all cursor-pointer">
                <img src={plan.icon} alt={plan.name} className="w-12 h-12 mb-4 rounded-full object-cover" />
                <h3 className="text-[10px] font-black uppercase mb-2">{plan.name}</h3>
                <p className="text-lg font-black text-blue-700 mb-6">KES {plan.price}</p>
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}