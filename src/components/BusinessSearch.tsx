"use client"

import { useState } from "react"
import VisibilityGauge from "./VisibilityGauge" // Ensure this path is correct

export default function BusinessSearch() {
  const [business, setBusiness] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runAudit = async () => {
    if (!business) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`
      );

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Audit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">DAPC Visibility Audit</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Business name"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="border rounded-lg p-4 text-lg"
        />
        <input
          type="text"
          placeholder="City (e.g Nairobi)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-lg p-4 text-lg"
        />
        <button
          onClick={runAudit}
          className="bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>
      </div>

      {result && (
        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold mb-4">Visibility Score</h3>
          <VisibilityGauge score={result.visibilityScore || 0} />
          {/* Add other result metrics here as needed */}
        </div>
      )}
    </div>
  )
}