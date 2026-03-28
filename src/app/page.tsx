"use client";

import React, { useState } from "react";
import { Loader2, MessageCircle, CheckCircle2 } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

// ... LoadingOverlay component remains the same ...

export default function LandingPage() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isPaying, setIsPaying] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handlePayment = async (amount: number, planName: string) => {
    if (!user) {
      openSignIn({ afterSignInUrl: "/" });
      return;
    }

    setIsPaying(true);
    setSelectedAmount(amount);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: "254722973020", // Use dynamic number if you have a state for it
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setIsPaying(false);
        alert(`Payment initialization failed: ${data.message}`);
      }
    } catch (error) {
      setIsPaying(false);
      alert("An error occurred. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {isPaying && <LoadingOverlay message={`Initializing KES ${selectedAmount.toLocaleString()} payment...`} />}

      {/* NAV SECTION (Same as before) */}
      <nav className="flex justify-between items-center px-10 py-8 max-w-7xl mx-auto">
        <div style={{ fontWeight: 950 }} className="text-4xl text-blue-600 italic tracking-tighter">DAPC</div>
        <div className="flex items-center gap-4">
          <SignedOut><button onClick={() => openSignIn()} className="text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-4 rounded-full">Sign In</button></SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-20 px-6">
        {/* HERO & SEARCH (Same as before) */}
        <div className="text-center mb-20">
            <h1 style={{ fontWeight: 900 }} className="text-7xl md:text-8xl text-slate-950 tracking-tighter leading-none mb-6">
                Choose Your <span className="text-blue-600 italic">Growth Speed.</span>
            </h1>
            <p className="text-slate-500 font-bold">Select a plan to audit your visibility and start generating leads.</p>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {DAPC_PLANS.map((plan) => (
            <div key={plan.name} className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
              <div>
                <div className="text-5xl mb-6">{plan.icon}</div>
                <h3 style={{ fontWeight: 900 }} className="text-2xl text-slate-950 uppercase tracking-tighter mb-2">{plan.name}</h3>
                <p className="text-slate-400 font-bold text-sm mb-6 leading-relaxed">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-slate-400 font-bold text-lg">KES</span>
                  <span className="text-5xl font-black text-slate-950 tracking-tighter">{plan.price.toLocaleString()}</span>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
              </div>

              <button 
                onClick={() => handlePayment(plan.price, plan.name)}
                style={{ fontWeight: 900 }}
                className="w-full py-5 rounded-2xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-900 text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="text-center bg-blue-600 text-white p-12 rounded-[50px] shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Official Payment Details</p>
            <h2 style={{ fontWeight: 900 }} className="text-3xl mb-2">Paybill: 516600</h2>
            <p className="text-xl opacity-80">Account: 0675749001</p>
        </div>
      </main>

      {/* WHATSAPP (Floating) */}
      <div onClick={() => window.open("https://wa.me/254722973020")} className="fixed bottom-10 right-10 z-50 bg-[#25D366] text-white p-6 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-all">
        <MessageCircle size={32} />
      </div>
    </div>
  );
}