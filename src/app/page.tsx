"use client";

import React from "react";
import { ShieldCheck, TrendingUp, Zap, MessageCircle } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100">
      {/* NAVBAR */}
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
        <div className="relative max-w-4xl mx-auto group mb-32">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[35px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
            <BusinessSearch />
          </div>
        </div>

        {/* FEATURE TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LOCAL ACCURACY */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <ShieldCheck className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Local Accuracy</h3>
            <p className="text-slate-400 font-bold leading-relaxed">
              Advanced analysis of the Kenyan search ecosystem and local consumer behavior.
            </p>
          </div>

          {/* DISCOVERY RANK */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <TrendingUp className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Discovery Rank</h3>
            <p className="text-slate-400 font-bold leading-relaxed">
              See where you actually appear when customers search for your category in Nairobi.
            </p>
          </div>

          {/* LEAD STRATEGY */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <Zap className="text-blue-600 group-hover:text-white" size={30} />
            </div>
            <h3 style={{ fontWeight: 900, letterSpacing: "-0.03em" }} className="text-2xl text-slate-900 mb-4">Lead Strategy</h3>
            <p className="text-slate-400 font-bold leading-relaxed">
              Turn low visibility scores into actionable sales leads and digital dominance.
            </p>
          </div>
        </div>
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