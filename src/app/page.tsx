"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const plans = [
  { name: "Starter", amount: "1,999", img: "/starter-cheetah.jpg", desc: "Digital Foundation", animal: "Cheetah" },
  { name: "Local Boost", amount: "3,999", img: "/boost-buffalo.jpg", desc: "Local Map Mastery", animal: "Buffalo" },
  { name: "Growth", amount: "5,999", img: "/growthengine-rhino.jpg", desc: "Lead Gen Engine", popular: true, animal: "Rhino" },
  { name: "Market Leader", amount: "7,999", img: "/marketleader-elephant.jpg", desc: "Regional Dominance", animal: "Elephant" },
  { name: "Super Active", amount: "10,000", img: "/superactivevisibility-lion.jpg", desc: "Enterprise Intelligence", animal: "Lion" },
];

export default function LandingPage() {
  const { userId } = useAuth();
  const [business, setBusiness] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 antialiased">
      
      {/* 1. BRANDED NAV */}
      <nav className="h-14 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center">
          <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-6">
          {userId ? <UserButton /> : (
            <SignInButton mode="modal">
              <button className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-600 transition-all">Login</button>
            </SignInButton>
          )}
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 shadow-lg shadow-blue-100 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* 2. CENTERED HERO */}
      <header className="pt-10 pb-8 text-center bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4">
            Kenya Market Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Is Your Business <span className="text-blue-600">Visible?</span>
          </h1>
          <p className="text-slate-400 text-[13px] max-w-lg mx-auto mb-8 font-medium">
            Audit your digital footprint across Nairobi instantly.
          </p>

          <div className="max-w-xl mx-auto flex p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-blue-900/5">
            <input 
              type="text" 
              placeholder="Enter Business Name..." 
              className="flex-1 px-4 py-2 text-sm outline-none"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
            <button className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Run Free Audit
            </button>
          </div>
        </div>
      </header>

      {/* 3. BIG FIVE PRICING LIST */}
      <main className="container mx-auto px-6 max-w-5xl py-8">
        <div className="space-y-3">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex items-center p-4 rounded-2xl border transition-all hover:bg-white hover:shadow-xl ${
                plan.popular 
                ? "bg-white border-blue-400 shadow-lg ring-1 ring-blue-400/20" 
                : "bg-white/50 border-slate-100"
              }`}
            >
              {/* ANIMAL ICON BADGE */}
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white shrink-0">
                <img src={plan.img} alt={plan.animal} className="w-full h-full object-cover" />
              </div>
              
              <div className="ml-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base">{plan.name}</h3>
                  {plan.popular && <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase">Active</span>}
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{plan.animal} Tier • {plan.desc}</p>
              </div>

              <div className="w-40 text-center border-l border-slate-100">
                <span className="text-xl font-black text-slate-900 tracking-tighter">KES {plan.amount}</span>
                <span className="text-[10px] text-slate-400 font-bold block">MONTHLY</span>
              </div>

              <div className="ml-8">
                <button className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  plan.popular 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="py-6 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <img src="/dapc-logo.jpg" alt="DAPC" className="h-4 opacity-50 grayscale" />
            <span>© 2026 DAPC AFRICA</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-blue-600">Legal</a>
            <a href="#" className="hover:text-blue-600">Security</a>
            <a href="#" className="hover:text-blue-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}