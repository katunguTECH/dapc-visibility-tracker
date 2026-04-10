"use client";

import { useState } from "react";
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing"; // ✅ IMPORTANT
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

    const count = Number(localStorage.getItem("search_count") || "0");

    if (count >= 5) {
      alert("You’ve reached the free limit. Please sign in to continue.");
      return;
    }

    localStorage.setItem("search_count", (count + 1).toString());

    try {
      setLoading(true);

      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(query)}`
      );

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Audit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="font-bold text-xl text-blue-600">DAPC</h1>

        <div className="flex items-center gap-6">
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

      {/* HERO */}
      <div className="text-center mt-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold leading-tight mb-4">
          Is Your Business
          <br />
          <span className="text-blue-600">Visible Online?</span>
        </h2>

        <p className="text-gray-500 mb-8">
          Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
        </p>

        <div className="w-full">
          <input
            type="text"
            placeholder="Enter business name (e.g. Langata Hospital)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-xl px-4 py-4 mb-4 shadow-sm"
          />

          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg"
          >
            {loading ? "Running Audit..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {data && (
        <div className="px-4 mt-12 max-w-4xl mx-auto">
          <VisibilityCard {...data} />
        </div>
      )}

      {/* ✅ PRICING WITH M-PESA */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        <h3 className="text-2xl font-bold text-center mb-10">
          Choose Your Growth Tier
        </h3>

        <Pricing />
      </div>
    </main>
  );
}