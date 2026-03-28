"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

const DAPC_PLANS = [
  { name: "Starter Listing", price: 1999, description: "For small or offline businesses", icon: "🐆" },
  { name: "Local Boost", price: 3999, description: "Increase real customer actions", icon: "🐂" },
  { name: "Growth Engine", price: 5999, description: "Ready for consistent monthly leads", icon: "🦏" },
  { name: "Market Leader", price: 7999, description: "Position ahead of competitors", icon: "🐘" },
  { name: "Super Active", price: 10000, description: "Maximum global exposure", icon: "🦁" },
];

export default function LandingPage() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [showPricing, setShowPricing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePlanSelection = async (amount: number) => {
    if (!user) {
      openSignIn();
      return;
    }
    setIsPaying(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phoneNumber: "254722973020" }),
      });
      const data = await res.json();
      if (!data.success) alert(`Error: ${data.message}`);
    } catch (error) {
      alert("Payment failed to initialize.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* 1. ORIGINAL NAV RESTORED */}
      <nav className="flex justify-between items-center px-10 py-8 max-w-7xl mx-auto">
        <div style={{ fontWeight: 950 }} className="text-4xl text-blue-600 italic tracking-tighter">DAPC</div>
        <div className="flex items-center gap-4">
          <SignedOut><button onClick={() => openSignIn()} className="text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-4 rounded-full">Sign In</button></SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* 2. ORIGINAL HERO & SEARCH RESTORED */}
      <main className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-16">
          <h1 style={{ fontWeight: 900 }} className="text-7xl md:text-8xl text-slate-950 tracking-tighter leading-none mb-6">
            Is Your Business <span className="text-blue-600 italic">Visible Online?</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto">Analyze your digital footprint across Kenya's search landscape in seconds.</p>
        </div>

        <BusinessSearch />

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => setShowPricing(true)}
            className="bg-blue-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
          >
            Unlock Full Access
          </button>
        </div>
      </main>

      {/* 3. SUBSCRIPTION MODAL (ONLY SHOWS ON CLICK) */}
      {showPricing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[50px] w-full max-w-5xl p-10 relative">
            <button onClick={() => setShowPricing(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-950"><X size={32}/></button>
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter">Select Your Growth Plan</h2>
              <p className="font-bold text-slate-400">Choose a speed to start your professional audit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DAPC_PLANS.map((plan) => (
                <div key={plan.name} className="border-2 border-slate-50 p-8 rounded-[40px] hover:border-blue-600 transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-4xl">{plan.icon}</span>
                    <h3 className="font-black mt-4 text-xl">{plan.name}</h3>
                    <div className="text-3xl font-black my-4">KES {plan.price.toLocaleString()}</div>
                  </div>
                  <button 
                    disabled={isPaying}
                    onClick={() => handlePlanSelection(plan.price)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600"
                  >
                    {isPaying ? "Processing..." : `Select ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP */}
      <div onClick={() => window.open("https://wa.me/254722973020")} className="fixed bottom-10 right-10 z-50 bg-[#25D366] text-white p-6 rounded-full shadow-2xl cursor-pointer">
        <MessageCircle size={32} />
      </div>
    </div>
  );
}