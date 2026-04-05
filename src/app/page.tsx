"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  { name: "Starter", amount: 1999, icon: "starter-cheetah", description: "Basic visibility setup", popular: false },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo", description: "Maps & local ranking", popular: false },
  { name: "Growth", amount: 5999, icon: "growthengine-rhino", description: "Lead generation engine", popular: true },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant", description: "Dominate competitors", popular: false },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion", description: "Premium insights", popular: false },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!business) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      
      {/* 1. COMPACT NAV */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/dapc-logo.jpg" alt="Logo" className="h-6 w-auto" />
            <span className="font-bold text-lg tracking-tight">DAPC</span>
          </div>
          <div className="flex items-center gap-3">
            {userId ? <UserButton afterSignOutUrl="/" /> : (
              <SignInButton mode="modal">
                <button className="text-xs font-semibold text-slate-500 hover:text-blue-600">Sign In</button>
              </SignInButton>
            )}
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-900 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. TIGHT HERO SECTION */}
      <section className="pt-12 pb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            Kenya Market Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Is Your Business <span className="text-blue-600">Visible?</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm text-slate-500 mb-8">
            Audit your digital footprint in Nairobi instantly.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-1.5 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-col md:flex-row gap-1">
            <input
              type="text"
              placeholder="Business name (e.g. Safari Park Hotel)"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all"
            >
              {loading ? "Analyzing..." : "Run Free Audit"}
            </button>
          </div>
        </div>
      </section>

      {/* 3. COMPACT PRICING GRID */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative p-5 rounded-3xl transition-all border ${
                plan.popular 
                ? "bg-white border-blue-500 shadow-lg ring-1 ring-blue-500" 
                : "bg-white border-slate-100 shadow-sm hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black px-3 py-0.5 rounded-full uppercase">
                  Popular
                </div>
              )}
              
              {/* SHRINKED ICONS */}
              <img src={`/icons/${plan.icon}.jpg`} className="h-12 w-12 mx-auto mb-3 object-contain" alt={plan.name} />
              
              <h3 className="text-sm font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-[10px] text-slate-400 mb-4 h-6 overflow-hidden leading-tight">{plan.description}</p>
              
              <div className="mb-5">
                <span className="text-lg font-black text-slate-900">KES {plan.amount.toLocaleString()}</span>
                <span className="text-slate-400 text-[10px]">/mo</span>
              </div>

              <button
                className={`w-full py-2.5 rounded-xl text-[10px] font-black transition-all ${
                  plan.popular 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {userId ? "M-Pesa Pay" : "Select Plan"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TIGHT FOOTER */}
      <footer className="border-t border-slate-100 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 Drive Africa Performance Center</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}