"use client";
import { useState, useEffect } from "react";
import { UserButton, useSignIn, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { 
  Check, Search, ArrowRight, MapPin, Share2, 
  Users, Globe, AlertCircle, BarChart3, Smartphone 
} from "lucide-react";
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

  // Load search count from local storage
  useEffect(() => {
    const savedCount = localStorage.getItem("dapc_search_count");
    if (savedCount) setSearchCount(parseInt(savedCount));
  }, []);

  const handleAudit = async () => {
    if (!businessName.trim()) return;

    // Check for "One Free Search" limit
    if (searchCount >= 1 && !isSignedIn) {
      alert("You've used your free audit! Please sign in to see more results.");
      openSignIn?.({});
      return;
    }

    setIsAuditing(true);

    try {
      // Calling the API route we created
      const res = await fetch(`/api/visibility?business=${encodeURIComponent(businessName)}&location=Nairobi&t=${Date.now()}`);
      const data = await res.json();
      
      setReport(data.audit);

      // Increment count for non-signed in users
      if (!isSignedIn) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem("dapc_search_count", newCount.toString());
      }
    } catch (error) {
      console.error("Audit error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-6">
          <SignedOut>
            <button onClick={() => openSignIn?.({})} className="text-sm font-bold text-slate-500 hover:text-blue-700">Login</button>
            <button onClick={() => openSignIn?.({})} className="bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg hover:bg-black transition">Get Started</button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
            <h1 className="text-6xl font-black tracking-tight mb-6 leading-tight">
              Business <span className="text-blue-700">Intelligence</span> <br/> for Nairobi
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Scan your Google Maps, Social Media, and SEO footprint in real-time.
            </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-3 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl mx-auto mb-16">
            <div className="flex-1 flex items-center px-4 gap-3">
              <Search size={20} className="text-slate-300" />
              <input 
                className="w-full outline-none text-lg font-bold" 
                placeholder="Business Name (e.g. Langata Hospital)" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAudit()}
              />
            </div>
            <button 
              onClick={handleAudit}
              disabled={isAuditing}
              className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-black transition disabled:opacity-50"
            >
              {isAuditing ? "Analyzing..." : "Run Audit"} <ArrowRight size={18} />
            </button>
        </div>

        {/* AUDIT RESULTS DASHBOARD */}
        {report ? (
          <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Score */}
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-center items-center shadow-2xl text-center">
              <BarChart3 className="text-blue-400 mb-4" size={32} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Visibility Score</p>
              <div className="text-8xl font-black text-red-400">{report.score}<span className="text-2xl opacity-20">/100</span></div>
              <div className="mt-6 flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full text-[10px] font-black uppercase">
                <AlertCircle size={14} /> High Risk: Low Lead Capture
              </div>
            </div>

            {/* Geo & Social Presence */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm space-y-8">
               <div className="flex items-start gap-4">
                 <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl"><MapPin size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Google Maps (GMB)</p>
                    <p className="font-bold text-slate-900">{report.googleMaps.status}</p>
                    <p className="text-xs text-slate-500 mt-1">{report.googleMaps.issue}</p>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl"><Share2 size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Social Presence</p>
                    <div className="flex gap-2">
                        <Badge label="Facebook" active={report.socials.facebook.found} />
                        <Badge label="TikTok" active={report.socials.tiktok.found} />
                        <Badge label="X" active={report.socials.x.found} />
                    </div>
                 </div>
               </div>

               <div className="flex items-start gap-4">
                 <div className="p-3 bg-orange-50 text-orange-700 rounded-2xl"><Globe size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">SEO & Tech</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Speed: {report.seo.loadSpeed}</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Mobile: {report.seo.mobileFriendly ? 'YES' : 'NO'}</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Competitor Benchmarking */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Market Rivals</p>
                  <Users size={18} className="text-slate-300" />
               </div>
               <div className="space-y-6">
                 {report.competitors.map((comp: any, i: number) => (
                   <div key={i}>
                      <div className="flex justify-between text-xs font-black mb-2 text-slate-700 uppercase tracking-tighter">
                        <span>{comp.name}</span>
                        <span>{comp.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${comp.score}%` }}
                        ></div>
                      </div>
                   </div>
                 ))}
               </div>
               <div className="mt-10 p-4 bg-blue-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-blue-800 leading-relaxed text-center italic">
                    "Your top rivals are capturing leads by appearing in 'Near Me' search results where you are missing."
                  </p>
               </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE / MOCK DASHBOARD */
          <div className="opacity-20 grayscale pointer-events-none grid lg:grid-cols-3 gap-6">
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
          </div>
        )}
      </header>

      {/* PRICING */}
      <section className="bg-white py-32 px-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Choose Your Growth Tier</h2>
            <p className="text-slate-500 font-medium">Select a plan to fix the gaps found in your audit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-200 flex flex-col items-center hover:border-blue-700 transition-all">
                <img src={plan.icon} alt={plan.name} className="w-16 h-16 mb-6 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
                <h3 className="text-[10px] font-black text-slate-900 text-center uppercase mb-4 tracking-tighter">{plan.name}</h3>
                <p className="text-xl font-black text-blue-700 mb-10">KES {plan.price}</p>
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper component for Social Badges
function Badge({ label, active }: { label: string, active: boolean }) {
  return (
    <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest border ${
      active 
        ? 'bg-green-50 text-green-700 border-green-100' 
        : 'bg-slate-50 text-slate-300 border-slate-100'
    }`}>
      {label}
    </span>
  );
}