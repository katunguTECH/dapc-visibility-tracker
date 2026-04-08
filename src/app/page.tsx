"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser, useSignIn } from "@clerk/nextjs";
import Pricing from "../components/Pricing";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  // Free search counter
  const [searchCount, setSearchCount] = useState(0);
  const maxFreeSearches = 5;
  const [businessName, setBusinessName] = useState("");

  const handleSearch = () => {
    if (!businessName) return alert("Enter a business name!");
    if (searchCount >= maxFreeSearches && !isSignedIn) {
      openSignIn?.();
      return;
    }
    setSearchCount((prev) => prev + 1);
    // Simulate search API
    console.log("Searching for", businessName);
    alert(`Search executed for ${businessName}. Free searches used: ${searchCount + 1}/${maxFreeSearches}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="py-20 px-6 text-center bg-blue-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Business Intelligence for Nairobi
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Scan your Google Maps, Social Media, and SEO footprint in real-time.
        </p>

        {!isSignedIn && (
          <button
            onClick={() => openSignIn?.()}
            className="bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition"
          >
            Sign in to get started
          </button>
        )}
      </section>

      {/* BIG FIVE ICONS */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Big Five Visibility</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Image src="/icons/starter-cheetah.jpg" alt="Starter Cheetah" width={80} height={80} />
          <Image src="/icons/boost-buffalo.jpg" alt="Local Boost Buffalo" width={80} height={80} />
          <Image src="/icons/growthengine-rhino.jpg" alt="Growth Engine Rhino" width={80} height={80} />
          <Image src="/icons/marketleader-elephant.jpg" alt="Market Leader Elephant" width={80} height={80} />
          <Image src="/icons/supervisibility-lion.jpg" alt="Super Active Lion" width={80} height={80} />
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="py-10 px-6 text-center">
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Enter business name (e.g. Java House)"
          className="border p-2 rounded w-1/2 mb-4"
        />
        <div>
          <button
            onClick={handleSearch}
            className="bg-blue-700 text-white py-2 px-6 rounded-xl hover:bg-blue-800"
          >
            Run Audit
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Free searches used: {searchCount}/{maxFreeSearches}
        </p>
      </section>

      {/* PRICING */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Growth Tier</h2>
        <Pricing />
      </section>
    </main>
  );
}