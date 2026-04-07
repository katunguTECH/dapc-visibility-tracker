// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { UserButton, useSignIn, useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { Search, ArrowRight, MapPin, Share2, BarChart3 } from "lucide-react";

import Pricing from "../components/Pricing";

/* =========================
   MAIN COMPONENT
========================= */
export default function LandingPage() {
  const [businessName, setBusinessName] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const { openSignIn } = useSignIn();
  const { isSignedIn } = useUser();

  /* Load search count from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("dapc_search_count");
    if (saved) setSearchCount(parseInt(saved));
  }, []);

  /* =========================
     AUDIT FUNCTION
  ========================== */
  const handleAudit = async () => {
    if (!businessName.trim()) return;

    if (searchCount >= 1 && !isSignedIn) {
      alert("You've used your free audit! Please sign in.");
      openSignIn?.({});
      return;
    }

    setIsAuditing(true);

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(businessName)}&location=Nairobi&t=${Date.now()}`
      );
      const data = await res.json();
      setReport(data.audit);

      if (!isSignedIn) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem("dapc_search_count", newCount.toString());
      }
    } catch (err) {
      console.error(err);
      alert("Audit failed");
    } finally {
      setIsAuditing(false);
    }
  };

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white border-b">
        <img src="/dapc-logo.jpg" className="h-10" alt="DAPC Logo" />

        <div className="flex gap-4">
          <SignedOut>
            <button onClick={() => openSignIn?.()}>Login</button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded">
              Get Started
            </button>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center py-16 px-6">
        <h1 className="text-5xl font-black mb-4">
          Business Intelligence for Nairobi
        </h1>
        <p className="text-gray-500">
          Scan your Google Maps, SEO & social visibility instantly
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex gap-3 max-w-2xl mx-auto mb-12 bg-white p-3 rounded-xl shadow">
        <input
          className="flex-1 p-3 outline-none"
          placeholder="Enter business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAudit()}
        />

        <button
          onClick={handleAudit}
          disabled={isAuditing}
          className="bg-blue-700 text-white px-6 rounded"
        >
          {isAuditing ? "Analyzing..." : "Run Audit"}
        </button>
      </div>

      {/* AUDIT RESULTS */}
      {report ? (
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mb-20">

          {/* SCORE */}
          <div className="bg-black text-white p-8 rounded-2xl text-center">
            <BarChart3 className="mx-auto mb-4" />
            <h2 className="text-4xl font-black">{report.score}/100</h2>
          </div>

          {/* MAP STATUS */}
          <div className="bg-white p-6 rounded-2xl">
            <MapPin />
            <p>{report.googleMaps?.status}</p>
          </div>

          {/* SOCIAL STATUS */}
          <div className="bg-white p-6 rounded-2xl">
            <Share2 />
            <p>Social Presence</p>
          </div>

        </div>
      ) : (
        <div className="opacity-20 grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-20">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      )}

      {/* PRICING SECTION */}
      <Pricing />

    </div>
  );
}