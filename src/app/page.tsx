"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MessageCircle, 
  Loader2 
} from "lucide-react";
import { 
  SignInButton, 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser 
} from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

// 1. PROFESSIONAL LOADING OVERLAY COMPONENT
const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md transition-all duration-500">
    <div className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center border border-slate-100 max-w-sm text-center animate-in fade-in zoom-in duration-300">
      <div className="relative mb-6">
        <Loader2 className="animate-spin text-blue-600" size={48} strokeWidth={3} />
        <div className="absolute inset-0 blur-xl bg-blue-600/20 animate-pulse"></div>
      </div>
      <h3 style={{ fontWeight: 900 }} className="text-2xl text-slate-900 mb-2 uppercase tracking-tighter">
        Awaiting M-Pesa
      </h3>
      <p className="text-slate-500 font-bold leading-relaxed text-sm">
        {message}
      </p>
      <div className="mt-8 px-6 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Do not refresh this page
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  const { user } = useUser();
  const [isPaying, setIsPaying] = useState(false);

  // 2. MPESA PAYMENT HANDLER
  const handlePayment = async () => {
    if (!user) {
      alert("Please sign in to subscribe.");
      return;
    }

    setIsPaying(true);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2500, // KES 2,500 for the Pro Plan
          phoneNumber: "254722973020", // Subscriber number
        }),
      });

      const data = await res.json();
      
      if (!data.success) {
        setIsPaying(false);
        alert("Payment initialization failed: " + (data.message || "Unknown error"));
      }
      // Note: If success, we keep isPaying true so the overlay stays visible 
      // while the user enters their PIN on their phone.
    } catch (error) {
      console.error("Payment error:", error);
      setIsPaying(false);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100 font-sans">
      
      {/* LOADING OVERLAY TRIGGER */}
      {isPaying && (
        <LoadingOverlay message="Please check your phone for the M-Pesa PIN prompt to complete your DAPC subscription." />
      )}

      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-10 py-8 max-w-7xl mx-auto">
        <div
          style={{ fontWeight: 950, fontStyle: "italic", letterSpacing: "-0.07em" }}
          className="text-4xl text-blue-600"
        >
          DAPC
        </div>
        
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Exposure</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Leads</a>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-20 pb-32 px-6">
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h1
            style={{ fontWeight: 900, letterSpacing: "-0.07em", lineHeight: "0.85" }}
            className="text-6xl md:text-9xl text-slate-950 mb-10"
          >
            Stop Guessing Your <br />
            <span className="text-blue-600 italic">Digital Impact.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
            Kenya&apos;s real-time market intelligence engine. Audit your visibility and find growth gaps in seconds.
          </p>
        </div>

        {/* BUSINESS SEARCH COMPONENT */}
        <div className="relative max-w-4xl mx-auto group mb-40">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[35px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
            <BusinessSearch />
          </div>
        </div>

        {/* FEATURE TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <ShieldCheck className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Local Accuracy</h3>
            <p className="text-slate-400 font-bold leading-relaxed">Advanced analysis of the Kenyan search ecosystem and local consumer behavior.</p>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <TrendingUp className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Discovery Rank</h3>
            <p className="text-slate-400 font-bold leading-relaxed">See where you actually appear when customers search for your category in Nairobi.</p>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <Zap className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Lead Strategy</h3>
            <p className="text-slate-400 font-bold leading-relaxed">Turn low visibility scores into actionable sales leads and digital dominance.</p>
          </div>
        </div>

        {/* PRICING SECTION */}
        <section className="mt-40 mb-20 text-center">
          <h2 style={{ fontWeight: 900, letterSpacing: '-0.05em' }} className="text-5xl text-slate-950 mb-16">
            Ready to <span className="text-blue-600 italic">Dominate</span> the Market?
          </h2>

          <div className="max-w-md mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[45px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-white border border-slate-100 p-12 rounded-[40px] shadow-2xl">
              <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Most Popular
              </div>
              <h3 style={{ fontWeight: 900 }} className="text-3xl text-slate-900 mb-2">Pro Audit Plan</h3>
              <div className="flex justify-center items-baseline gap-1 mb-8">
                <span className="text-slate-400 text-xl font-bold">KES</span>
                <span className="text-6xl font-black tracking-tighter text-slate-950">2,500</span>
                <span className="text-slate-400 font-bold">/mo</span>
              </div>

              <ul className="text-left space-y-4 mb-10">
                {["Full SEO Visibility Audit", "Google Maps Ranking Tracker", "Competitor Gap Analysis", "WhatsApp Lead Integration", "Priority Market Intel Support"].map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <div className="bg-blue-600 rounded-full p-1">
                      <Zap size={12} className="text-white" fill="white" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <button 
                onClick={handlePayment}
                disabled={isPaying}
                style={{ fontWeight: 900 }}
                className="w-full bg-slate-950 hover:bg-blue-600 text-white py-6 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
              >
                {isPaying ? <Loader2 className="animate-spin" size={16} /> : "Unlock Full Access"}
              </button>
              
              <p className="mt-6 text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                Secure Payment via Lipa na M-Pesa
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING WHATSAPP CTA */}
      <div
        onClick={() => typeof window !== "undefined" && window.open("https://wa.me/254722973020", "_blank")}
        className="fixed bottom-10 right-10 z-50 bg-[#25D366] text-white p-6 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.3)] cursor-pointer hover:scale-110 transition-all flex items-center gap-4 group"
      >
        <MessageCircle size={32} fill="white" className="text-[#25D366]" />
        <span style={{ fontWeight: 900 }} className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 uppercase tracking-[0.2em] text-[11px] whitespace-nowrap">
          Chat with us
        </span>
      </div>
    </div>
  );
}