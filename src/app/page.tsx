"use client";

import { useState } from "react";
import Pricing from "@/components/Pricing";
import { VisibilityCard } from "@/components/VisibilityCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!query) {
      alert("Please enter a business name");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Audit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">

      {/* NAV */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-bold text-xl text-blue-600">DAPC</h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Home</a>
          <a href="#">Exposure</a>
          <a href="#">Leads</a>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center mt-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold leading-tight">
          Is Your Business
          <br />
          <span className="text-blue-600">Visible Online?</span>
        </h2>

        <p className="text-gray-500 mt-4">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        <div className="mt-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter business name (e.g. Langata Hospital)"
            className="w-full border rounded-xl px-4 py-4"
          />

          <button
            onClick={handleAudit}
            className="w-full bg-blue-600 text-white py-4 rounded-xl mt-4 font-semibold"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {data && (
        <div className="mt-12 max-w-4xl mx-auto px-4">
          <VisibilityCard {...data} />
        </div>
      )}

      {/* PRICING + M-PESA */}
      <div className="mt-20">
        <h3 className="text-2xl font-bold text-center mb-8">
          Choose Your Growth Tier
        </h3>

        <Pricing />
      </div>

    </main>
  );
}