"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser, useSignIn } from "@clerk/nextjs";
import Pricing from "../components/Pricing";
import Report from "../components/Report";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [businessName, setBusinessName] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!businessName) return alert("Enter a business name!");
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
    <main className="min-h-screen bg-gray-50 text-gray-950">
      
      {/* Header with Logo */}
      <header className="flex justify-between items-center py-6 px-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Image 
            src="/dapc-logo.jpg" 
            alt="DAPC Logo" 
            width={120} 
            height={40} 
            className="object-contain"
          />
        </div>
        
        {!isSignedIn && (
          <button 
            onClick={() => openSignIn?.()}
            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold"
          >
            ?
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black leading-none tracking-tighter mb-8">
            <span className="block">Is Your</span>
            <span className="block mb-2">Business</span>
            <span className="block text-blue-700">Visible</span>
            <span className="block text-blue-700">Online?</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-10 max-w-2xl mx-auto font-medium">
             Scan your Google Maps, Social Media, and SEO footprint in Nairobi, Kenya.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-10 px-6 text-center max-w-3xl mx-auto">
        <div className="relative mb-6">
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="Enter business name (e.g. 'Safaricom')"
            className="w-full text-2xl border-2 border-gray-200 p-6 rounded-2xl focus:border-blue-500 transition"
          />
           <button
             onClick={handleSearch}
             className="absolute right-4 top-4 bottom-4 bg-blue-700 text-white px-8 rounded-xl font-bold"
           >
             {loading ? "..." : "Run Audit"}
           </button>
        </div>
      </section>

      {reportData && <Report data={reportData} />}

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl font-black text-center mb-16 tracking-tighter">Choose Your Growth Tier</h2>
        <Pricing />
      </section>
    </main>
  );
}