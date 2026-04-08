"use client";

import { useState, useEffect } from "react";
import { useSignIn, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  // Load saved searches
  useEffect(() => {
    const count = localStorage.getItem("dapc_search_count");
    if (count) setSearchCount(parseInt(count));
  }, []);

  const handleSearch = async () => {
    if (!business) return;

    // 🚫 Limit: 5 free searches
    if (!isSignedIn && searchCount >= 5) {
      alert("Free limit reached. Please sign in to continue.");
      openSignIn?.();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/visibility?business=${encodeURIComponent(business)}&location=Nairobi&t=${Date.now()}`
      );

      const data = await res.json();
      console.log("RESULT:", data);

      // Save usage for non-signed users
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
            <button
              onClick={() => openSignIn?.()}
              className="bg-blue-700 text-white px-5 py-2 rounded-xl"
            >
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
        <h1 className="text-5xl font-black mb-4">
          Business Intelligence for Nairobi
        </h1>
        <p className="text-lg mb-8">
          Scan your Google Maps, Social Media, and SEO footprint in real-time.
        </p>

        {/* ✅ SEARCH BAR RESTORED */}
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

        {/* Free usage indicator */}
        {!isSignedIn && (
          <p className="mt-4 text-sm opacity-80">
            Free searches used: {searchCount}/5
          </p>
        )}
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/starter-cheetah.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Fast Visibility</h3>
          <p>Get discovered quickly in local search.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/boost-buffalo.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Stronger Presence</h3>
          <p>Dominate Google Maps & rankings.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/growthengine-rhino.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Predictable Growth</h3>
          <p>Turn visibility into real customers.</p>
        </div>
      </section>

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
                  if (!isSignedIn) {
                    openSignIn?.();
                  } else {
                    alert("Proceed to payment flow");
                  }
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