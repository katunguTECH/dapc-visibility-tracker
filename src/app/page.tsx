"use client";

import { useState } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    // ✅ LIMIT: 5 searches
    const searches = Number(localStorage.getItem("search_count") || "0");

    if (searches >= 5) {
      alert("Please sign in to continue.");
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
      {/* ✅ NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="font-bold text-xl">DAPC Logo</h1>

        <div className="flex gap-6 items-center">
          <a href="#">Home</a>
          <a href="#">Exposure</a>
          <a href="#">Leads</a>

          <SignedOut>
            <SignInButton>
              <button className="bg-black text-white px-4 py-2 rounded-lg">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* ✅ HERO SECTION */}
      <div className="text-center mt-16 px-4">
        <h2 className="text-4xl font-bold mb-4">
          Is Your Business Visible Online?
        </h2>

        <p className="text-gray-600 mb-8">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        {/* 🐘 BIG FIVE IMAGE ICONS */}
        <div className="flex justify-center gap-6 mb-10 flex-wrap">
          <img
            src="/icons/supervisibility-lion.jpg"
            alt="Lion"
            className="w-16 h-16 object-cover rounded-full shadow"
          />
          <img
            src="/icons/marketleader-elephant.jpg"
            alt="Elephant"
            className="w-16 h-16 object-cover rounded-full shadow"
          />
          <img
            src="/icons/starter-cheetah.jpg"
            alt="Cheetah"
            className="w-16 h-16 object-cover rounded-full shadow"
          />
          <img
            src="/icons/growthengine-rhino.jpg"
            alt="Rhino"
            className="w-16 h-16 object-cover rounded-full shadow"
          />
          <img
            src="/icons/boost-buffalo.jpg"
            alt="Buffalo"
            className="w-16 h-16 object-cover rounded-full shadow"
          />
        </div>

        {/* ✅ SEARCH */}
        <div className="w-full max-w-xl mx-auto">
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
      </div>

      {/* ✅ RESULTS */}
      {data && (
        <div className="px-4">
          <VisibilityCard data={data} />
        </div>
      )}
    </main>
  );
}