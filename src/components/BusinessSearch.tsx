"use client"; // required for client-side interactivity
import { useState } from "react";

export default function BusinessSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: query }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      console.error(err);
      setError("Error fetching analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter business name"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 w-full"
        disabled={loading || !query.trim()}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <pre className="bg-gray-100 p-2 mt-2 text-sm overflow-x-auto">
          {result}
        </pre>
      )}
    </div>
  );
}