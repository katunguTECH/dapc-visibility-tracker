"use client";

import { useState } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setData(null);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error("Audit error:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">DAPC Visibility Audit</h1>

      {/* INPUT (FIXED name/id for accessibility warning) */}
      <input
        id="business"
        name="business"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter business name"
        className="border p-3 w-full mb-3"
      />

      <button
        onClick={runAudit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Running..." : "Run Audit"}
      </button>

      {/* RESULTS (SAFE RENDER) */}
      <div className="mt-6">
        {data?.business ? (
          <VisibilityCard {...data} />
        ) : null}
      </div>

      {/* PRICING */}
      <div className="mt-10">
        <Pricing />
      </div>
    </main>
  );
}