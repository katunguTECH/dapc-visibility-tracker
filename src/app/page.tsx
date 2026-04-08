"use client";

import { useState } from "react";
import Image from "next/image";
import Pricing from "../components/Pricing";
import { useUser, useSignIn } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();
  const [searchCount, setSearchCount] = useState(0);

  const handleSearch = () => {
    if (searchCount >= 5 && !isSignedIn) {
      openSignIn?.();
      return;
    }
    setSearchCount((prev) => prev + 1);
    // Run your audit/search function here
    alert(`Running search #${searchCount + 1}`);
  };

  const icons = [
    { name: "Starter Listing", src: "/icons/starter-cheetah.jpg" },
    { name: "Local Boost", src: "/icons/boost-buffalo.jpg" },
    { name: "Growth Engine", src: "/icons/growthengine-rhino.jpg" },
    { name: "Market Leader", src: "/icons/marketleader-elephant.jpg" },
    { name: "Super Active", src: "/icons/supervisibility-lion.jpg" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-6">
      {/* HERO */}
      <section className="text-center py-20 bg-blue-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Business Intelligence for Nairobi</h1>
        <p className="text-lg md:text-2xl mb-6">Scan your Google Maps, Social Media, and SEO footprint in real-time.</p>
        {!isSignedIn && (
          <button
            onClick={() => openSignIn?.()}
            className="bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition"
          >
            Sign in to get started
          </button>
        )}
      </section>

      {/* Big Five Section */}
      <section className="py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Big Five</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {icons.map((icon) => (
            <div key={icon.name} className="bg-white shadow-lg rounded-3xl p-4 text-center w-40">
              <Image src={icon.src} alt={icon.name} width={120} height={120} className="mx-auto mb-2 rounded-xl" />
              <p className="font-semibold">{icon.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="text-center py-10">
        <input
          type="text"
          placeholder="Enter business name (e.g. Java House)"
          className="border p-2 rounded-lg w-1/2 mb-4"
        />
        <br />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-green-700 transition"
        >
          Run Audit
        </button>
        <p className="mt-2">Free searches used: {searchCount}/5</p>
      </section>

      {/* Pricing */}
      <section className="py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Choose Your Growth Tier</h2>
        <Pricing isSignedIn={isSignedIn} />
      </section>
    </main>
  );
}