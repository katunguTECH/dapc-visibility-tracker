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

  useEffect(() => {
    const saved = localStorage.getItem("dapc_search_count");
    if (saved) setSearchCount(parseInt(saved));
  }, []);

  const handleAudit = async () => {
    if (!businessName.trim()) return;

    if (!isSignedIn && searchCount >= 1) {
      alert("Please sign in to continue.");
      openSignIn?.();
      return;
    }

    setIsAuditing(true);

    try {
      const res = await fetch(`/api/visibility?business=${encodeURIComponent(businessName)}&location=Nairobi&t=${Date.now()}`);
      const data = await res.json();
      setReport(data.audit);

      if (!isSignedIn) {
        const count = searchCount + 1;
        setSearchCount(count);
        localStorage.setItem("dapc_search_count", count.toString());
      }
    } catch (err) {
      console.error(err);
      alert("Audit failed");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* NAVBAR */}
      <nav className="flex justify-between px-10 py-5 bg-white border-b">
        <img src="/dapc-logo.jpg" className="h-10" />
        <div className="flex gap-4 items-center">
          <SignedOut>
            <button onClick={() => openSignIn?.()} className="text-sm font-bold">
              Login
            </button>
            <button
              onClick={() => openSignIn?.()}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <header className="text-center py-16 px-6">
        <h1 className="text-5xl font-black mb-4">
          Business <span className="text-blue-700">Intelligence</span> for Nairobi
        </h1>
        <p className="text-slate-500 mb-10">
          Scan your Google Maps, Social Media, and SEO footprint in real-time.
        </p>

        {/* SEARCH */}
        <div className="flex max-w-xl mx-auto bg-white p-3 rounded-xl shadow">
          <input
            className="flex-1 outline-none px-4"
            placeholder="Business Name (e.g. Safaricom)"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <button
            onClick={handleAudit}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            {isAuditing ? "Analyzing..." : "Run Audit"}
          </button>
        </div>
      </header>

      {/* PRICING */}
      <Pricing />

    </div>
  );
}