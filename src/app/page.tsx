// src/app/page.tsx
"use client";

import { useState, Suspense } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";

// Simple loading component
function LoadingState() {
  return (
    <div className="mt-6 p-8 bg-white rounded-2xl shadow-md text-center">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <p className="text-gray-600 mt-4">Running visibility audit...</p>
    </div>
  );
}

// Error display component
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
      <h3 className="text-red-800 font-semibold mb-2">Audit Failed</h3>
      <p className="text-red-600">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

// No data state
function NoDataState() {
  return (
    <div className="mt-6 p-8 bg-gray-50 rounded-2xl text-center border border-gray-200">
      <p className="text-gray-600">
        Enter a business name above and click "Run Audit" to see visibility results
      </p>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    // Reset states
    setError(null);
    setData(null);

    // Validate input
    if (!query.trim()) {
      setError("Please enter a business name");
      return;
    }

    setLoading(true);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const res = await fetch(`/api/visibility?business=${encodedQuery}`);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      // Strict validation to prevent React #130
      if (!json || typeof json !== "object") {
        throw new Error("Invalid API response format");
      }

      // Ensure all required fields exist with proper types
      const validatedData = {
        business: json.business || query.trim(),
        score: typeof json.score === "number" ? json.score : 0,
        seoScore: typeof json.seoScore === "number" ? json.seoScore : 0,
        mapsPresence: typeof json.mapsPresence === "boolean" ? json.mapsPresence : false,
        social: {
          facebook: json.social?.facebook === true,
          twitter: json.social?.twitter === true,
          instagram: json.social?.instagram === true,
          tiktok: json.social?.tiktok === true,
        },
        competitors: Array.isArray(json.competitors) ? json.competitors : [],
      };

      setData(validatedData);
    } catch (err: any) {
      console.error("Audit error:", err);
      setError(err.message || "Failed to run visibility audit. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      runAudit();
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">DAPC Visibility Audit</h1>
      
      <p className="text-gray-600 mb-6">
        Check how visible your business is across search engines, Google Maps, and social media
      </p>

      {/* Search Input Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name
        </label>
        <div className="flex gap-3">
          <input
            id="business"
            name="business"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Java House, Safaricom, KCB Bank"
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            disabled={loading}
          />
          <button
            onClick={runAudit}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Running..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && <ErrorDisplay message={error} />}

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Results Section with Suspense for better error handling */}
      <div className="mt-6">
        <Suspense fallback={<LoadingState />}>
          {!loading && !error && data && <VisibilityCard {...data} />}
          {!loading && !error && !data && <NoDataState />}
        </Suspense>
      </div>

      {/* Pricing Section */}
      <div className="mt-12">
        <Pricing />
      </div>
    </main>
  );
}