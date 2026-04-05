"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

// Subscription plans with icons
const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah" },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo" },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino" },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant" },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion" },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [business, setBusiness] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [canAudit, setCanAudit] = useState(true); // default true for non-logged-in
  const [statusMessage, setStatusMessage] = useState("");

  // ✅ Check if user can perform free audit
  useEffect(() => {
    if (!isLoaded || !userId) return;

    axios
      .get(`/api/user/status/${userId}`)
      .then((res) => {
        setCanAudit(res.data.canAudit);
        setStatusMessage(res.data.message);
      })
      .catch(console.error);
  }, [isLoaded, userId]);

  // Run visibility audit
  const handleSearch = async () => {
    if (!business) return alert("Enter your business name");

    if (!userId && !canAudit) {
      alert("Sign in to perform more visibility checks.");
      return router.push("/sign-in");
    }

    if (!canAudit) {
      router.push("/subscribe");
      return;
    }

    setLoading(true);
    setSearchResult(null);

    // Simulate audit delay
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 10;

      setSearchResult({
        name: business,
        location: "Nairobi",
        score,
        website: Math.min(20, Math.floor(score * 0.25)),
        search: Math.min(20, Math.floor(score * 0.25)),
        maps: Math.min(20, Math.floor(score * 0.25)),
        social: Math.min(20, Math.floor(score * 0.25)),
        seo: Math.min(20, Math.floor(score * 0.25)),
        gaps: [
          "Weak Google Maps presence",
          "Low search visibility",
          "Weak social media presence",
          "Poor SEO optimization",
        ],
      });

      setLoading(false);

      // Increment free audit for logged-in users
      if (userId && canAudit) {
        axios.post(`/api/user/increment-audit/${userId}`).catch(console.error);
        setCanAudit(false);
        setStatusMessage("You have used your free audit. Subscribe for more.");
      }
    }, 1500);
  };

  // Handle STK Push payment
  const handlePay = async (planName: string, amount: number) => {
    if (!isLoaded || !userId) {
      alert("Sign in to pay.");
      return router.push("/sign-in");
    }

    const phoneNumber = prompt(`Enter your Safaricom M-Pesa number for ${planName}:`);
    if (!phoneNumber) return;

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phoneNumber, amount, planName }),
      });
      const data = await res.json();
      alert(data.message || "STK Push sent. Complete payment on your phone.");
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <header className="flex flex-col items-center mb-12 border-b pb-8">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-24 mb-4 object-contain" />
        <h1 className="text-4xl font-black text-center">
          Is Your Business Visible Online?
        </h1>
      </header>

      {/* Audit Input */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-2xl flex gap-3">
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Enter business name..."
            className="border-2 border-gray-200 p-4 w-full rounded-2xl"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold"
          >
            {loading ? "Analyzing..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* Free audit / subscription message */}
      {userId && statusMessage && (
        <p className="text-center text-red-500 mb-6">{statusMessage}</p>
      )}

      {/* Audit Result */}
      {searchResult && (
        <div className="mb-16 p-8 bg-white rounded-3xl shadow-lg">
          <h2 className="text-3xl font-black">{searchResult.name}</h2>
          <p>Location: {searchResult.location}</p>
          <p>Score: {searchResult.score}/100</p>
        </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-3xl font-black mb-4 text-center">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="p-6 bg-white rounded-3xl shadow-md text-center relative overflow-hidden"
          >
            <img
              src={`/icons/${plan.icon}.jpg`}
              alt={plan.name}
              className="h-32 w-32 object-contain mb-4 mx-auto"
            />
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-blue-600 text-2xl mb-4">KES {plan.amount.toLocaleString()}</p>
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className="bg-green-600 text-white py-3 px-6 rounded-xl font-bold"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}