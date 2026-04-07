"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { UserButton, useSignIn, useUser, SignedIn, SignedOut } from "@clerk/nextjs";

import { 
  Check, Search, ArrowRight, MapPin, Share2, 
  Users, Globe, AlertCircle, BarChart3, Smartphone 
} from "lucide-react";

/**
 * ✅ FIX: Proper dynamic import to avoid React error #306
 */
const MpesaModal = dynamic(
  () => import("../components/MpesaModal").then(mod => mod.default),
  { ssr: false }
);

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

  const handleAudit = async () => {
    if (!businessName.trim()) return;

    if (searchCount >= 1 && !isSignedIn) {
      alert("You've used your free audit! Please sign in to see more results.");
      openSignIn?.({});
      return;
    }

    setIsAuditing(true);

    try {
      const res = await fetch(`/api/visibility?business=${encodeURIComponent(businessName)}&location=Nairobi&t=${Date.now()}`);
      const data = await res.json();
      
      setReport(data.audit);

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
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
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
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
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

        {/* RESULTS */}
        {report ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 text-center">
              <BarChart3 className="text-blue-400 mb-4" size={32} />
              <div className="text-6xl font-black">{report.score}/100</div>
            </div>
          </div>
        ) : (
          <div className="opacity-20 grid lg:grid-cols-3 gap-6">
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
            <div className="bg-slate-200 h-64 rounded-[2.5rem]"></div>
          </div>
        )}

      </header>

      {/* PRICING */}
      <section className="bg-white py-32 px-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-4">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="p-6 border rounded-2xl text-center">
              <img src={plan.icon} className="w-16 h-16 mx-auto mb-4 rounded-full" />
              <h3 className="text-sm font-bold">{plan.name}</h3>
              <p className="text-blue-700 font-black mb-4">KES {plan.price}</p>

              {/* ✅ Mpesa Modal (fixed) */}
              <MpesaModal 
                amount={plan.price.replace(",", "")} 
                planName={plan.name} 
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}