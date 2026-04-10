"use client";

import { useState } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    // ✅ LIMIT TO 5 SEARCHES
    const searches = Number(localStorage.getItem("search_count") || "0");

    if (searches >= 5) {
      alert("Please sign in to continue using the tool.");
      return;
    }

    localStorage.setItem("search_count", (searches + 1).toString());

    try {
      setLoading(true);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      <div className="text-center mt-12">
        <h1 className="text-4xl font-bold">
          Is Your Business Visible Online?
        </h1>
        <p className="text-gray-600 mt-2">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>
      </div>

      {/* ✅ CLEAN SEARCH UI */}
      <div className="w-full max-w-xl mx-auto mt-10">
        <input
          type="text"
          placeholder="Enter business name (e.g. Langata Hospital)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-3"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90"
        >
          {loading ? "Running Audit..." : "Run Audit"}
        </button>
      </div>

      {/* RESULTS */}
      {data && <VisibilityCard data={data} />}
    </main>
  );
}
