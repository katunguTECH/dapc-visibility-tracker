"use client";

import { useState, useEffect } from "react";
import { useSignIn, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface AuditResult {
  business: string;
  visibilityScore: number;
  socialScore: number;
  seoScore: number;
  topCompetitors: string[];
}

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [results, setResults] = useState<AuditResult | null>(null);

  useEffect(() => {
    const count = localStorage.getItem("dapc_search_count");
    if (count) setSearchCount(parseInt(count));
  }, []);

  const handleSearch = async () => {
    if (!business) return;

    if (!isSignedIn && searchCount >= 5) {
      alert("Free limit reached. Please sign in to continue.");
      openSignIn?.();
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=Nairobi&t=${Date.now()}`
      );
      const data = await res.json();
      console.log("AUDIT RESULT:", data);

      // Simulated format
      const audit: AuditResult = {
        business: business,
        visibilityScore: data.visibilityScore || Math.floor(Math.random() * 100),
        socialScore: data.socialScore || Math.floor(Math.random() * 100),
        seoScore: data.seoScore || Math.floor(Math.random() * 100),
        topCompetitors: data.topCompetitors || ["Competitor A", "Competitor B", "Competitor C"],
      };

      setResults(audit);

      if (!isSignedIn) {
        const newCount = searchCount + 1;
        setSearchCount(newCount);
        localStorage.setItem("dapc_search_count", newCount.toString());
      }
    } catch (err) {
      console.error(err);
      alert("Error running audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white border-b">
        <img src="/dapc-logo.jpg" className="h-10" />
        <div className="flex gap-4 items-center">
          <SignedOut>
            <button onClick={() => openSignIn?.()}>Login</button>
            <button onClick={() => openSignIn?.()} className="bg-blue-700 text-white px-5 py-2 rounded-xl">
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <h1 className="text-5xl font-black mb-4">Business Intelligence for Nairobi</h1>
        <p className="text-lg mb-8">Scan your Google Maps, Social Media, and SEO footprint in real-time.</p>

        <div className="max-w-2xl mx-auto flex bg-white rounded-xl overflow-hidden shadow-lg">
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Enter business name (e.g. Java House)"
            className="flex-1 p-4 text-black outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-black text-white px-6 font-bold"
          >
            {loading ? "Analyzing..." : "Run Audit"}
          </button>
        </div>

        {!isSignedIn && (
          <p className="mt-4 text-sm opacity-80">Free searches used: {searchCount}/5</p>
        )}
      </section>

      {/* AUDIT RESULTS */}
      {results && (
        <section className="max-w-4xl mx-auto py-16 px-6">
          <h2 className="text-3xl font-black mb-6">{results.business} Audit Results</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-bold mb-2">Visibility</h3>
              <p className="text-xl">{results.visibilityScore}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-bold mb-2">Social Media</h3>
              <p className="text-xl">{results.socialScore}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h3 className="font-bold mb-2">SEO</h3>
              <p className="text-xl">{results.seoScore}%</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold mb-2">Top Competitors</h3>
            <ul className="list-disc pl-5">
              {results.topCompetitors.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* PRICING */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-black mb-10">Choose Your Growth Tier</h2>

        <div className="grid md:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {[
            { name: "Starter Listing", price: 1999 },
            { name: "Local Boost", price: 3999 },
            { name: "Growth Engine", price: 5999 },
            { name: "Market Leader", price: 7999 },
            { name: "Super Active", price: 10000 },
          ].map((plan, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-bold">{plan.name}</h3>
              <p className="text-xl font-bold mb-4">KES {plan.price}</p>

              <button
                onClick={() => {
                  if (!isSignedIn) openSignIn?.();
                  else alert("Proceed to payment flow");
                }}
                className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
              >
                {isSignedIn ? "Subscribe" : "Sign In to Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}