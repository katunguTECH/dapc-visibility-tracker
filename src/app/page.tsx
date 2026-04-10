"use client";

import { useState } from "react";
import Pricing from "@/components/Pricing";
import VisibilityCard from "@/components/VisibilityCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!query.trim()) {
      alert("Please enter a business name");
      return;
    }

    try {
      setLoading(true);
      setData(null);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const result = await res.json();

      // 🛡️ SAFE GUARD (prevents React #130)
      if (!result || typeof result !== "object") {
        alert("Invalid response from server");
        return;
      }

      setData(result);
    } catch (error) {
      console.error("Audit error:", error);
      alert("Audit failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-bold text-xl text-blue-600">DAPC</h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Home</a>
          <a href="#">Exposure</a>
          <a href="#">Leads</a>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="text-center mt-14 max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold">
          Is Your Business Visible Online?
        </h2>

        <p className="text-gray-500 mt-2">
          SEO, Google Maps & Social Media Visibility Scan (Kenya)
        </p>

        {/* INPUT */}
        <div className="mt-6">
          <input
            id="business-input"
            name="business"
            className="border px-4 py-3 w-full rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter business name (e.g. Langata Hospital)"
          />

          <button
            onClick={handleAudit}
            className="bg-blue-600 text-white w-full py-3 mt-3 rounded-xl font-semibold"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="mt-10 px-4 max-w-4xl mx-auto">

        {loading && (
          <div className="text-center text-gray-500">
            Running visibility analysis...
          </div>
        )}

        {!loading && data && (
          <VisibilityCard {...data} />
        )}

      </div>

      {/* PRICING */}
      <div className="mt-16">
        <Pricing />
      </div>

    </main>
  );
}