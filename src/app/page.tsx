"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser, useSignIn } from "@clerk/nextjs";
import Pricing from "../components/Pricing";
import Report from "../components/Report";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [searchCount, setSearchCount] = useState(0);
  const maxFreeSearches = 5;
  const [businessName, setBusinessName] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!businessName) return alert("Enter a business name!");
    if (searchCount >= maxFreeSearches && !isSignedIn) {
      openSignIn?.();
      return;
    }

    setSearchCount(prev => prev + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/visibility?business=${encodeURIComponent(businessName)}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch visibility data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
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

      {/* Big Five Icons */}
      <section className="py-10 px-6 text-center">
        <div className="flex flex-wrap justify-center gap-6">
          {["starter-cheetah.jpg","boost-buffalo.jpg","growthengine-rhino.jpg","marketleader-elephant.jpg","supervisibility-lion.jpg"].map(icon => (
            <Image key={icon} src={`/icons/${icon}`} alt={icon} width={80} height={80}/>
          ))}
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-10 px-6 text-center">
        <input
          type="text"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          placeholder="Enter business name (e.g. Langata Hospital)"
          className="border p-2 rounded w-1/2 mb-4"
        />
        <div>
          <button
            onClick={handleSearch}
            className="bg-blue-700 text-white py-2 px-6 rounded-xl hover:bg-blue-800"
          >
            {loading ? "Searching..." : "Run Audit"}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Free searches used: {searchCount}/{maxFreeSearches}
        </p>
      </section>

      {reportData && <Report data={reportData} />}

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Growth Tier</h2>
        <Pricing />
      </section>
    </main>
  );
}
