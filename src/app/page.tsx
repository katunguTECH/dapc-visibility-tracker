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

      {/* ✅ HERO */}
      <div className="text-center mt-16 px-4">
        <h2 className="text-4xl font-bold mb-4">
          Is Your Business Visible Online?
        </h2>

        <p className="text-gray-600 mb-8">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        {/* 🐘 BIG FIVE IMAGES */}
        <div className="flex justify-center gap-6 mb-10 flex-wrap">
          <img src="/icons/supervisibility-lion.jpg" className="w-16 h-16 rounded-full object-cover shadow" />
          <img src="/icons/marketleader-elephant.jpg" className="w-16 h-16 rounded-full object-cover shadow" />
          <img src="/icons/starter-cheetah.jpg" className="w-16 h-16 rounded-full object-cover shadow" />
          <img src="/icons/growthengine-rhino.jpg" className="w-16 h-16 rounded-full object-cover shadow" />
          <img src="/icons/boost-buffalo.jpg" className="w-16 h-16 rounded-full object-cover shadow" />
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

      {/* 💰 PRICING */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold text-center mb-10">
          Choose Your Growth Tier
        </h3>

        <div className="grid md:grid-cols-3 gap-6">

          {/* STARTER */}
          <div className="border rounded-2xl p-5 shadow hover:shadow-lg transition">
            <img src="/icons/starter-cheetah.jpg" className="w-16 h-16 rounded-full mb-4" />
            <h4 className="font-bold text-lg">Starter Listing</h4>
            <p className="text-gray-500 text-sm mb-2">For small or offline businesses</p>
            <p className="text-xl font-bold mb-4">KES 1,999</p>
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          </div>

          {/* LOCAL BOOST */}
          <div className="border rounded-2xl p-5 shadow hover:shadow-lg transition">
            <img src="/icons/boost-buffalo.jpg" className="w-16 h-16 rounded-full mb-4" />
            <h4 className="font-bold text-lg">Local Boost</h4>
            <p className="text-gray-500 text-sm mb-2">Improve Maps & local visibility</p>
            <p className="text-xl font-bold mb-4">KES 3,999</p>
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          </div>

          {/* GROWTH ENGINE */}
          <div className="border rounded-2xl p-5 shadow hover:shadow-lg transition">
            <img src="/icons/growthengine-rhino.jpg" className="w-16 h-16 rounded-full mb-4" />
            <h4 className="font-bold text-lg">Growth Engine</h4>
            <p className="text-gray-500 text-sm mb-2">Consistent monthly leads</p>
            <p className="text-xl font-bold mb-4">KES 5,999</p>
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          </div>

          {/* MARKET LEADER */}
          <div className="border rounded-2xl p-5 shadow hover:shadow-lg transition">
            <img src="/icons/marketleader-elephant.jpg" className="w-16 h-16 rounded-full mb-4" />
            <h4 className="font-bold text-lg">Market Leader</h4>
            <p className="text-gray-500 text-sm mb-2">Dominate competitive markets</p>
            <p className="text-xl font-bold mb-4">KES 7,999</p>
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          </div>

          {/* SUPER VISIBILITY */}
          <div className="border rounded-2xl p-5 shadow hover:shadow-lg transition md:col-span-2">
            <img src="/icons/supervisibility-lion.jpg" className="w-16 h-16 rounded-full mb-4" />
            <h4 className="font-bold text-lg">Super Active Visibility</h4>
            <p className="text-gray-500 text-sm mb-2">Maximum exposure & growth</p>
            <p className="text-xl font-bold mb-4">KES 10,000</p>
            <button className="w-full bg-black text-white py-2 rounded-lg">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}