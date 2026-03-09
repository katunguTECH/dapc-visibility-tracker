"use client";

import { useState } from "react";
import VisibilityGauge from "./VisibilityGauge"; // your circular progress bar component
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!business) return;

    setLoading(true);

    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business }),
      });

      const data = await res.json();

      // Merge the searched business with competitors
      const searchedBusiness = {
        name: business,
        reach: Math.floor(Math.random() * 5000),
        seoScore: Math.floor(Math.random() * 100),
      };

      const allData = [searchedBusiness, ...(data.competitors || [])];
      setResults(allData);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">AI Business Visibility Analyzer</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter business name"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {results && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">{results[0].name}</h2>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-32 h-32">
              <VisibilityGauge score={results[0].seoScore} />
            </div>
            <div>
              <p className="text-lg">Estimated Reach: {results[0].reach}</p>
              <p className="text-lg">SEO Score: {results[0].seoScore}%</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">Top Competitors</h3>
          <ul className="mb-6 space-y-2">
            {results.slice(1).map((c: any) => (
              <li key={c.name} className="flex justify-between border p-2 rounded">
                <span>{c.name}</span>
                <span>Reach: {c.reach} | SEO: {c.seoScore}%</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">Reach Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reach" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}