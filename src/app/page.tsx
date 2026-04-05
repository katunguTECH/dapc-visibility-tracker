"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  { name: "Starter", amount: "1,999", tag: "Cheetah", desc: "Basic visibility setup" },
  { name: "Local Boost", amount: "3,999", tag: "Buffalo", desc: "Maps & local ranking" },
  { name: "Growth", amount: "5,999", tag: "Rhino", desc: "Lead generation engine", popular: true },
  { name: "Market Leader", amount: "7,999", tag: "Elephant", desc: "Dominate competitors" },
  { name: "Super Active", amount: "10,000", tag: "Lion", desc: "Premium insights" },
];

export default function LandingPage() {
  const { userId } = useAuth();
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* ULTRA-THIN NAV */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/dapc-logo.jpg" alt="DAPC" className="h-5 w-auto" />
            <span className="font-black text-sm tracking-tighter">DAPC TRACKER</span>
          </div>
          <div className="flex items-center gap-6">
            {userId ? <UserButton afterSignOutUrl="/" /> : (
              <SignInButton mode="modal">
                <button className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Sign In</button>
              </SignInButton>
            )}
            <button className="bg-slate-950 text-white px-4 py-1.5 rounded-md text-[11px] font-bold hover:bg-blue-600 transition-all">
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* MINIMALIST HERO */}
      <header className="pt-12 pb-8 bg-slate-50/50 border-b border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-2">
            Market Intelligence <span className="text-blue-600">Reimagined.</span>
          </h1>
          <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Instant digital footprint audits for Kenyan enterprises.
          </p>

          <div className="max-w-xl mx-auto flex gap-2 p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Business Name..."
              className="flex-1 px-4 py-2 text-sm outline-none"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
            <button
              onClick={() => setLoading(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              {loading ? "Analysing..." : "Run Audit"}
            </button>
          </div>
        </div>
      </header>

      {/* SLEEK HORIZONTAL PRICING */}
      <section className="container mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Subscription Tiers</h2>
          <span className="text-[10px] font-medium text-slate-400 italic">*All prices in KES/month</span>
        </div>

        <div className="space-y-2">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                plan.popular 
                ? "border-blue-500 bg-blue-50/30 ring-1 ring-blue-500" 
                : "border-slate-100 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-4 w-1/3">
                {/* ICON AS A SMALL ACCENT */}
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                  <img 
                    src={`/icons/${plan.name.toLowerCase().replace(" ", "") === 'starter' ? 'starter-cheetah' : 
                          plan.name.toLowerCase().replace(" ", "") === 'localboost' ? 'boost-buffalo' :
                          plan.name.toLowerCase().replace(" ", "") === 'growth' ? 'growthengine-rhino' :
                          plan.name.toLowerCase().replace(" ", "") === 'marketleader' ? 'marketleader-elephant' : 'superactivevisibility-lion'}.jpg`} 
                    className="h-full w-full object-cover grayscale" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">{plan.name}</h3>
                    {plan.popular && <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Best Value</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">{plan.desc}</p>
                </div>
              </div>

              <div className="text-center w-1/3">
                <span className="text-lg font-black text-slate-900">{plan.amount}</span>
              </div>

              <div className="w-1/3 flex justify-end">
                <button className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  plan.popular ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-slate-900 text-white hover:bg-blue-600"
                }`}>
                  {userId ? "M-Pesa Checkout" : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MINIMAL FOOTER */}
      <footer className="py-8 border-t border-slate-100">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 DAPC AFRICA</p>
          <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600">Security</a>
            <a href="#" className="hover:text-blue-600">Legal</a>
            <a href="#" className="hover:text-blue-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}