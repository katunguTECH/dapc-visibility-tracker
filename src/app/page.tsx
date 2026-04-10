
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
      alert("Enter a business name");
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
    <main className="min-h-screen bg-white">

      {/* NAV */}
      <div className="flex justify-between px-6 py-4 border-b">
        <h1 className="font-bold text-xl text-blue-600">DAPC</h1>
        <div className="flex gap-6 text-sm">
          <a>Home</a>
          <a>Exposure</a>
          <a>Leads</a>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center mt-14 max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold">
          Is Your Business Visible Online?
        </h2>

        <p className="text-gray-500 mt-2">
          SEO, Maps & Social Media Intelligence for Kenya
        </p>

        <div className="mt-6">
          <input
            className="border px-4 py-3 w-full rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter business name"
          />

          <button
            onClick={handleAudit}
            className="bg-blue-600 text-white w-full py-3 mt-3 rounded-xl"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {data && (
        <div className="mt-10 px-4 max-w-4xl mx-auto">
          <VisibilityCard {...data} />
        </div>
      )}

      {/* PRICING */}
      <div className="mt-16">
        <Pricing />
      </div>

    </main>
  );
}