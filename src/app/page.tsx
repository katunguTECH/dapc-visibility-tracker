// src/app/page.tsx
'use client'; // Needed because we use useState and fetch in client component

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  const [query, setQuery] = useState("");        // User input
  const [result, setResult] = useState("");      // AI result
  const [loading, setLoading] = useState(false); // Loading state

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: query }),
      });

      const data = await res.json();
      setResult(data.output);
    } catch (err) {
      console.error(err);
      setResult("Error fetching analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold tracking-tight">DAPC Tracker</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="#features" className="hover:text-blue-600">Features</Link>
          <Link href="#pricing" className="hover:text-blue-600">Pricing</Link>
          <Link href="#search" className="hover:text-blue-600">AI Search</Link>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section with AI Search */}
      <section id="search" className="max-w-4xl mx-auto pt-20 pb-16 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Track Your Business <span className="text-blue-600">Visibility</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Search any business to see their digital footprint and lead potential.
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search business name or niche..." 
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="absolute right-3 top-3 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Show AI result */}
        {result && (
          <div className="mt-6 p-4 border rounded-md bg-gray-50 text-left whitespace-pre-wrap">
            {result}
          </div>
        )}
      </section>

      {/* Action Center / Features */}
      <section id="features" className="max-w-6xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        {/* Exposure Card */}
        <div className="p-8 border rounded-2xl hover:shadow-xl transition bg-white">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-6">
            📡
          </div>
          <h3 className="text-xl font-bold mb-3">Total Exposure</h3>
          <p className="text-gray-600 mb-4">Analyze how many people see your brand across all digital channels.</p>
          <Link href="/exposure" className="text-blue-600 font-medium hover:underline">View Analytics →</Link>
        </div>

        {/* Leads Card */}
        <div className="p-8 border rounded-2xl hover:shadow-xl transition bg-white">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
            📈
          </div>
          <h3 className="text-xl font-bold mb-3">Lead Tracker</h3>
          <p className="text-gray-600 mb-4">Real-time data on incoming inquiries and conversion potential.</p>
          <Link href="/leads" className="text-blue-600 font-medium hover:underline">Manage Leads →</Link>
        </div>

        {/* Pricing Card */}
        <div id="pricing" className="p-8 border-2 border-blue-600 rounded-2xl bg-blue-50 relative">
          <span className="absolute -top-3 left-8 bg-blue-600 text-white text-xs px-3 py-1 rounded-full uppercase font-bold">Best Value</span>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
            💎
          </div>
          <h3 className="text-xl font-bold mb-3">Pro Plan</h3>
          <p className="text-gray-600 mb-4">Unlimited searches and automated reporting for agencies.</p>
          <Link href="/pricing" className="text-blue-600 font-medium hover:underline">Upgrade Now →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-20 text-center text-gray-500 text-sm">
        <p>© 2026 DAPC Visibility Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}