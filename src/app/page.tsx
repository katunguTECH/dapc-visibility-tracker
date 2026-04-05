"use client";

import { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const plans = [
  { id: "S", name: "Starter", amount: "1,999", color: "bg-orange-50 text-orange-600", desc: "Basic setup" },
  { id: "B", name: "Local Boost", amount: "3,999", color: "bg-blue-50 text-blue-600", desc: "Google Maps" },
  { id: "G", name: "Growth", amount: "5,999", color: "bg-green-50 text-green-600", desc: "Lead engine", popular: true },
  { id: "M", name: "Market Leader", amount: "7,999", color: "bg-purple-50 text-purple-600", desc: "Full dominance" },
  { id: "A", name: "Super Active", amount: "10,000", color: "bg-red-50 text-red-600", desc: "Premium data" },
];

export default function LandingPage() {
  const { userId } = useAuth();
  const [business, setBusiness] = useState("");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col">
      
      {/* 1. SLIM NAV (Height: 48px) */}
      <nav className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded">D</div>
          <span className="font-bold text-sm tracking-tight">DAPC TRACKER</span>
        </div>
        <div className="flex gap-4">
          {userId ? <UserButton afterSignOutUrl="/" /> : <SignInButton mode="modal"><button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600">Login</button></SignInButton>}
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900">Get Started</button>
        </div>
      </nav>

      {/* 2. COMPACT HERO (Zero padding top, tight bottom) */}
      <section className="bg-slate-50/50 py-10 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Visibility <span className="text-blue-600">Analytics.</span></h1>
          <p className="text-xs text-slate-400 mb-6 font-medium">Audit your digital footprint across Kenya instantly.</p>
          
          <div className="flex max-w-md mx-auto p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
            <input 
              type="text" 
              placeholder="Business Name..." 
              className="flex-1 px-4 py-2 text-xs outline-none"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
            />
            <button className="bg-slate-900 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest">Audit</button>
          </div>
        </div>
      </section>

      {/* 3. PROFESSIONAL PRICING LIST */}
      <main className="flex-grow container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Platform Tiers</span>
          <span className="text-[10px] text-slate-300 italic">Enterprise Pricing / 2026</span>
        </div>

        <div className="space-y-1">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`flex items-center group p-3 rounded-lg border transition-all ${
                plan.popular ? "bg-blue-50/40 border-blue-200" : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="w-12">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center font-black text-xs ${plan.color}`}>
                  {plan.id}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-bold text-slate-800">{plan.name}</h3>
                  {plan.popular && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase font-black">Active</span>}
                </div>
                <p className="text-[10px] text-slate-400">{plan.desc}</p>
              </div>

              <div className="w-32 text-center">
                <span className="text-sm font-black text-slate-900">KES {plan.amount}</span>
                <span className="text-[9px] text-slate-400">/mo</span>
              </div>

              <div className="w-32 flex justify-end">
                <button className={`px-4 py-2 rounded text-[9px] font-black uppercase tracking-widest transition-all ${
                  plan.popular ? "bg-blue-600 text-white" : "bg-slate-900 text-white group-hover:bg-blue-600"
                }`}>
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. MINIMAL FOOTER */}
      <footer className="py-4 px-6 border-t border-slate-100 bg-white flex justify-between items-center text-[9px] font-bold text-slate-300 uppercase tracking-widest">
        <div>© 2026 DAPC AFRICA</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Legal</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}