"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type AnalysisResult = {
  name: string;
  seoScore: number;
  googleSearchResults: number;
  mapsPresence: string;
  estimatedReach: number;
  topCompetitors: { name: string; estimatedReach: number }[];
};

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBusiness = async () => {
    if (!business) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to analyze business");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to server");
    }

    setLoading(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        AI Business Visibility Analyzer
      </h2>

      <input
        type="text"
        placeholder="Enter business name"
        value={business}
        onChange={(e) => setBusiness(e.target.value)}
        className="border p-2 w-full mb-3 rounded"
      />

      <button
        onClick={analyzeBusiness}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <p className="mt-4 text-red-600 font-medium text-center">{error}</p>
      )}

      {result && (
        <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded">
          <p>
            <strong>Name:</strong> {result.name}
          </p>
          <p>
            <strong>SEO Score:</strong>{" "}
            <span className={scoreColor(result.seoScore)}>{result.seoScore}%</span>
          </p>
          <p>
            <strong>Google Search Results:</strong> {result.googleSearchResults}
          </p>
          <p>
            <strong>Maps Presence:</strong>{" "}
            <span
              className={
                result.mapsPresence === "Listed"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {result.mapsPresence}
            </span>
          </p>
          <p>
            <strong>Estimated Reach:</strong> {result.estimatedReach}
          </p>

          <h3 className="text-lg font-semibold mt-4">Top Competitors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.topCompetitors.map((c, i) => (
              <div
                key={i}
                className="border p-2 rounded shadow-sm hover:shadow-md transition"
              >
                <p className="font-medium">{c.name}</p>
                <p>Estimated Reach: {c.estimatedReach}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Bar
              data={{
                labels: [result.name, ...result.topCompetitors.map((c) => c.name)],
                datasets: [
                  {
                    label: "Estimated Reach",
                    data: [
                      result.estimatedReach,
                      ...result.topCompetitors.map((c) => c.estimatedReach),
                    ],
                    backgroundColor: "rgba(59,130,246,0.7)",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: "Business vs Competitors Reach" },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}