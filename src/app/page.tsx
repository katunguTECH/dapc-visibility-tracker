"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah", description: "For small businesses getting started", popular: false },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo", description: "Increase visibility & customer actions", popular: false },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino", description: "Generate consistent monthly leads", popular: true },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant", description: "Dominate competitors in your area", popular: false },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion", description: "Maximum exposure & premium insights", popular: false },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    if (!business) return;
    setLoading(true);
    setTimeout(() => {
      setSearchResult({ score: Math.floor(Math.random() * 40) + 20 });
      setLoading(false);
    }, 1500);
  };

  const handlePay = (planName: string, amount: number) => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }
    // M-Pesa logic...
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      
      {/* 1. STICKY NAV BAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/dapc-logo.jpg" alt="Logo" className="h-8 w-auto" />
            <span className="font-black text-xl tracking-tighter text-slate-900">DAPC</span>
          </div>
          <div className="flex items-center gap-4">
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Sign In</button>
              </SignInButton>
            )}
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.08)_0%,rgba(255,255,255,0)_100%)]"></div>
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Kenya Market Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Is Your Business <span className="text-blue-600">Visible</span> Online?
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-12 leading-relaxed">
            Instantly audit your digital footprint and see how you rank against competitors in Nairobi.
          </p>

          {/* 3. MODERN AUDIT TOOL */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter business name (e.g. Safari Park Hotel)"
                className="flex-1 px-6 py-4 rounded-2xl text-slate-900 outline-none placeholder:text-slate-400"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Analyzing..." : "Run Free Audit"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="container mx-auto px-6 py-24 border-t border-slate-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Subscription Plans</h2>
          <p className="text-slate-500">Choose a plan to dominate your local market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative p-8 rounded-[2.5rem] transition-all duration-300 ${
                plan.popular 
                ? "bg-white border-2 border-blue-500 shadow-2xl scale-105 z-10" 
                : "bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              <img src={`/icons/${plan.icon}.jpg`} className="h-20 w-20 mx-auto mb-6 grayscale hover:grayscale-0 transition-all" alt={plan.name} />
              <h3 className="text-lg font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-xs text-slate-400 mb-6 leading-tight">{plan.description}</p>
              
              <div className="mb-8">
                <span className="text-3xl font-black text-slate-900">KES {plan.amount.toLocaleString()}</span>
                <span className="text-slate-400 text-xs">/mo</span>
              </div>

              <button
                onClick={() => handlePay(plan.name, plan.amount)}
                className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${
                  plan.popular 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700" 
                  : "bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {userId ? "Pay via M-Pesa" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/dapc-logo.jpg" alt="Logo" className="h-6" />
            <p className="text-sm font-bold text-slate-400">© 2026 Drive Africa Performance Center</p>
          </div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}