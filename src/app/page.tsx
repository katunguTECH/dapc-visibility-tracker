"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const plans = [
  { name: "Starter", amount: "1,999", img: "/starter-cheetah.jpg", tier: "Cheetah", desc: "Digital Foundation" },
  { name: "Local Boost", amount: "3,999", img: "/boost-buffalo.jpg", tier: "Buffalo", desc: "Local Map Mastery" },
  { name: "Growth", amount: "5,999", img: "/growthengine-rhino.jpg", tier: "Rhino", desc: "Lead Gen Engine", popular: true },
  { name: "Market Leader", amount: "7,999", img: "/marketleader-elephant.jpg", tier: "Elephant", desc: "Regional Dominance" },
  { name: "Super Active", amount: "10,000", img: "/superactivevisibility-lion.jpg", tier: "Lion", desc: "Enterprise Intelligence" },
];

export default function LandingPage() {
  const { userId } = useAuth();
  const [business, setBusiness] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 1. SLIM NAV (Logo height locked to 28px) */}
      <nav className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-8 flex items-center justify-between">
        <img src="/dapc-logo.jpg" alt="DAPC" className="h-7 w-auto" /> 
        <div className="flex items-center gap-6">
          {userId ? <UserButton /> : (
            <SignInButton mode="modal">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600">Login</button>
            </SignInButton>
          )}
          <button className="bg-blue-600 text-white px-5 py-2 rounded text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. COMPACT HERO */}
      <header className="py-10 bg-white border-b border-slate-100 text-center">
        <div className="container mx-auto px-6">
          <div className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4">
            Kenya Market Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            Is Your Business <span className="text-blue-600 italic">Visible?</span>
          </h1>
          <p className="text-slate-400 text-xs mb-6 font-medium">
            Audit your digital footprint across Nairobi instantly[cite: 6].
          </p>

          <div className="max-w-xl mx-auto flex p-1 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
            <input 
              type="text" 
              placeholder="Enter Business Name..."
              className="flex-1 px-4 py-2 text-sm bg-transparent outline-none"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
              Run Free Audit
            </button>
          </div>
        </div>
      </header>

      {/* 3. PROFESSIONAL HORIZONTAL TABLE */}
      <main className="container mx-auto px-6 max-w-5xl py-8">
        <div className="space-y-2">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex items-center p-3 rounded-xl border transition-all ${
                plan.popular ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-300" : "bg-white border-slate-200 hover:border-blue-400"
              }`}
            >
              {/* ANIMAL ICON BADGE */}
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-white shrink-0 shadow-sm">
                <img src={plan.img} alt={plan.tier} className="w-full h-full object-cover" />
              </div>
              
              <div className="ml-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm">{plan.name}</h3>
                  {plan.popular && <span className="text-[7px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{plan.tier} Tier • {plan.desc} [cite: 10, 15, 21, 26, 31]</p>
              </div>

              <div className="w-32 text-center">
                <span className="text-sm font-black text-slate-900 tracking-tight">KES {plan.amount}</span>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-tighter">Monthly [cite: 11, 16, 22, 27, 32]</span>
              </div>

              <div className="ml-8">
                <button className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  plan.popular ? "bg-blue-600 text-white" : "bg-white border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                }`}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. REFINED FOOTER */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">© 2026 DAPC AFRICA • Market Intelligence [cite: 38]</p>
        <div className="flex justify-center gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-600">Legal</a>
          <a href="#" className="hover:text-blue-600">Security</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </div>
      </footer>
    </div>
  );
}