"use client";

import { useState } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setError(null);

    if (!query.trim()) {
      setError("Enter a business name");
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const json = await res.json();

      // 🛡️ STRICT VALIDATION (THIS PREVENTS REACT #130)
      if (
        !json ||
        typeof json !== "object" ||
        !json.business ||
        typeof json.score !== "number"
      ) {
        throw new Error("Invalid API response");
      }

      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Audit failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">DAPC Visibility Audit</h1>

      {/* INPUT SAFE */}
      <input
        id="business"
        name="business"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter business name"
        className="border p-3 w-full rounded-lg mb-3"
      />

      <button
        onClick={runAudit}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {loading ? "Running Audit..." : "Run Audit"}
      </button>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="mt-4 text-red-600 font-medium">{error}</div>
      )}

      {/* SAFE RENDER (CRITICAL FIX) */}
      <div className="mt-6">
        {data ? <VisibilityCard {...data} /> : null}
      </div>

      {/* PRICING ALWAYS SAFE */}
      <div className="mt-10">
        <Pricing />
      </div>
    </main>
  );
}