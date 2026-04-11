"use client";

import { useState } from "react";
import { VisibilityCard } from "@/components/VisibilityCard"; // ✅ FIXED IMPORT
import Pricing from "@/components/Pricing"; // ✅ keep pricing (M-PESA)

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!query.trim()) {
      alert("Enter business name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      // 🛡️ HANDLE API FAILURES
      if (!res.ok) {
        alert("API error: " + res.status);
        return;
      }

      const result = await res.json();

      // 🛡️ PREVENT REACT CRASH
      if (!result || typeof result !== "object") {
        alert("Invalid API response");
        return;
      }

      setData(result);
    } catch (err) {
      console.error(err);
      alert("Audit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* 🔷 NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-bold text-xl text-blue-600">DAPC</h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Home</a>
          <a href="#">Exposure</a>
          <a href="#">Leads</a>
        </div>
      </div>

      {/* 🔷 HERO */}
      <div className="text-center mt-16 px-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4">
          Is Your Business <br />
          <span className="text-blue-600">Visible Online?</span>
        </h2>

        <p className="text-gray-500 mb-6">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        {/* 🔍 INPUT */}
        <input
          id="business"
          name="business"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter business name (e.g. Langata Hospital)"
          className="w-full border px-4 py-3 rounded-lg mb-4"
        />

        {/* 🔍 BUTTON */}
        <button
          onClick={handleAudit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>
      </div>

      {/* 📊 RESULTS */}
      {data && data.business && (
        <div className="mt-10 px-4 max-w-xl mx-auto">
          <VisibilityCard
            business={data.business}
            score={data.score}
            seoScore={data.seoScore}
            mapsPresence={data.mapsPresence}
            social={data.social}
            competitors={data.competitors}
          />
        </div>
      )}

      {/* 💰 PRICING (M-PESA WORKS HERE) */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold text-center mb-8">
          Choose Your Growth Tier
        </h3>

        <Pricing />
      </div>

    </main>
  );
}