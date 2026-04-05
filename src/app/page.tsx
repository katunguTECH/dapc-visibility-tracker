"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah.jpg", description: "For small businesses getting started" },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo.jpg", description: "Increase visibility & customer actions" },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino.jpg", description: "Generate consistent monthly leads" },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant.jpg", description: "Dominate competitors in your area" },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion.jpg", description: "Maximum exposure & premium insights" },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const [business, setBusiness] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [canAudit, setCanAudit] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!isLoaded || !userId) return;

    axios.get(`/api/user/status/${userId}`)
      .then(res => {
        setCanAudit(res.data.canAudit);
        setStatusMessage(res.data.message);
      })
      .catch(err => console.error(err));
  }, [isLoaded, userId]);

  const handleSearch = async () => {
    if (!business) return alert("Enter a business name");

    if (!userId && !canAudit) {
      return alert("Sign in to perform more visibility checks.");
    }

    if (!canAudit) {
      return router.push("/subscribe");
    }

    setLoading(true);
    setSearchResult(null);

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
          "Poor SEO optimization"
        ],
      });
      setLoading(false);

      if (userId && canAudit) {
        axios.post(`/api/user/increment-audit/${userId}`).catch(console.error);
        setCanAudit(false);
        setStatusMessage("You have used your free audit. Subscribe for more.");
      }
    }, 1500);
  };

  const handlePay = async (planName: string, amount: number) => {
    if (!isLoaded || !userId) {
      alert("Please sign in to pay.");
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
      {/* Header / Logo */}
      <header className="flex flex-col items-center mb-12 border-b pb-8">
        <Image
          src="/dapc-logo.jpg"
          alt="DAPC Logo"
          width={200}
          height={100}
          className="mb-4 object-contain"
        />
        <h1 className="text-4xl font-black text-center">
          Is Your Business Visible Online?
        </h1>
      </header>

      {/* Audit Section */}
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

      {userId && <p className="text-center text-red-500 mb-6">{statusMessage}</p>}

      {/* Audit Results */}
      {searchResult && (
        <div className="mb-16 p-8 bg-white rounded-3xl shadow-lg">
          <h2 className="text-3xl font-black">{searchResult.name}</h2>
          <p>Location: {searchResult.location}</p>
          <p>Score: {searchResult.score}/100</p>
        </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-3xl font-black mb-4 text-center">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {plans.map(plan => (
          <div
            key={plan.name}
            className="group p-6 bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 transform -translate-y-full group-hover:translate-y-0 transition-transform"></div>
            <Image
              src={`/icons/${plan.icon}`}
              alt={plan.name}
              width={120}
              height={120}
              className="mb-4 rounded-full group-hover:scale-110 transform transition-transform duration-500"
            />
            <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-500 text-xs mb-2 h-10 leading-relaxed">{plan.description}</p>
            <p className="text-3xl font-black text-blue-600 mb-4">KES {plan.amount.toLocaleString()}</p>
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className="mt-auto w-full py-3 rounded-2xl font-black text-white bg-green-600 hover:bg-green-700 transition-all active:scale-95"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}