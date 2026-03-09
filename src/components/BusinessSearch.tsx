"use client";

import { useState } from "react";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);

    const res = await fetch("/api/competitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business, location }),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-xl shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">
        AI Competitor Visibility Analysis
      </h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Business name"
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button
        onClick={analyze}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Competitors"}
      </button>

      {results && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Competitors</h3>

          {results.competitors?.map((c: any, i: number) => (
            <div key={i} className="border p-3 mb-2 rounded">
              <p className="font-bold">{c.name}</p>
              <p>Rating: {c.rating}</p>
              <p>Reviews: {c.reviews}</p>
              <p>Visibility Score: {c.visibility}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}