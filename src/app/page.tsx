"use client";

import { useState, useEffect } from "react";
import { useUser, useSignIn, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Search, ArrowRight } from "lucide-react";
import Pricing from "../components/Pricing";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [businessName, setBusinessName] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [searchCount, setSearchCount] = useState(0);

  // Load search count from local storage
  useEffect(() => {
    const savedCount = localStorage.getItem("dapc_search_count");
    if (savedCount) setSearchCount(parseInt(savedCount));
  }, []);

  const handleAudit = async () => {
    if (!businessName.trim()) return;

    if (searchCount >= 1 && !isSignedIn) {
      alert("You've used your free audit! Please sign in to see more results.");
      openSignIn?.();
      return;
    }

    setIsAuditing(true);
    try {
      const res = await fetch(`/api/visibility?business=${encodeURIComponent(businessName)}&location=Nairobi&t=${Date.now()}`);
      const data = await res.json();
      setReport(data.audit);

      if (!isSignedIn) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem("dapc_search_count", newCount.toString());
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching audit.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-6">
          <SignedOut>
            <button onClick={() => openSignIn?.()} className="text-sm font-bold text-slate-500 hover:text-blue-700">Login</button>
            <button onClick={() => openSignIn?.()} className="bg-blue-700 text-white px-6 py-2 rounded-full font-black shadow-lg hover:bg-black transition">Get Started</button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <header className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-6xl font-black tracking-tight mb-6 leading-tight">
          Business <span className="text-blue-700">Intelligence</span> for Nairobi
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12">
          Scan your Google Maps, Social Media, and SEO footprint in real-time.
        </p>

        {/* SEARCH BAR */}
        <div className="flex gap-3 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl mx-auto mb-16">
          <div className="flex-1 flex items-center px-4 gap-3">
            <Search size={20} className="text-slate-300" />
            <input
              className="w-full outline-none text-lg font-bold"
              placeholder="Business Name (e.g. Langata Hospital)"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAudit()}
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-black transition disabled:opacity-50"
          >
            {isAuditing ? "Analyzing..." : "Run Audit"} <ArrowRight size={18} />
          </button>
        </div>
      </header>

      {/* PRICING CARDS */}
      <Pricing isSignedIn={isSignedIn} />
    </div>
  );
}