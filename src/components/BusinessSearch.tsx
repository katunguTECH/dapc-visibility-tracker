"use client";

import { useState } from "react";
import VisibilityDashboard from "./VisibilityDashboard";

export default function BusinessSearch() {

  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {

    if (!business) {
      alert("Enter a business name");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("/api/visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          location,
        }),
      });

      const data = await res.json();

      setResults(data);

    } catch (error) {

      console.error("Audit error:", error);
      alert("Audit failed. Check server logs.");

    }

    setLoading(false);
  };

  if (results) {
    return <VisibilityDashboard data={results} />;
  }

  return (
    <div className="text-center">

      <h1 className="text-4xl font-bold mb-3">
        Kenya Market Visibility Audit
      </h1>

      <p className="text-slate-600 mb-8">
        Analyze your business visibility across Kenya
      </p>

      <div className="flex justify-center gap-4">

        <input
          type="text"
          placeholder="Business name"
          className="border px-4 py-3 rounded-xl w-72"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />

        <input
          type="text"
          placeholder="City or county"
          className="border px-4 py-3 rounded-xl w-56"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button
          onClick={runAudit}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          {loading ? "Analyzing..." : "Start Visibility Audit"}
        </button>

      </div>

    </div>
  );
}