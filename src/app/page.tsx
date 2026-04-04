"use client";

import { useState } from "react";

const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah", description: "For small businesses getting started" },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo", description: "Increase visibility & customer actions" },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino", description: "Generate consistent monthly leads" },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant", description: "Dominate competitors in your area" },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion", description: "Maximum exposure & premium insights" },
];

const mockCompetitors = [
  { name: "Competitor A", score: 20 },
  { name: "Competitor B", score: 15 },
  { name: "Competitor C", score: 10 },
];

export default function LandingPage() {
  const [business, setBusiness] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    if (!business) return alert("Please enter a business name");

    const isFake = business.toLowerCase() === "safaripark hotel" || business.toLowerCase() === "safaricom";
    const score = isFake ? 33 : Math.floor(Math.random() * 40) + 10;

    setSearchResult({
      name: business,
      location: "Nairobi",
      score,
      website: Math.min(20, Math.floor(score * 0.25)),
      search: Math.min(20, Math.floor(score * 0.25)),
      maps: Math.min(20, Math.floor(score * 0.25)),
      social: Math.min(20, Math.floor(score * 0.25)),
      seo: Math.min(20, Math.floor(score * 0.25)),
      gaps: ["Weak Google Maps presence", "Low search visibility", "Weak social media presence", "Poor SEO optimization"],
      competitors: mockCompetitors,
    });
  };

  const handlePay = async (planName: string, amount: number) => {
    const phoneNumber = prompt(`Enter your Safaricom M-Pesa number for ${planName}:`);
    if (!phoneNumber) return alert("Phone number is required");

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount, planName }),
      });
      const data = await res.json();
      alert(data.message || "STK Push sent! Check your phone.");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 1. FIXED LOGO PATH & EXTENSION */}
      <header className="flex flex-col items-center mb-12 border-b pb-6">
        <img 
          src="/dapc-logo.jpg" 
          alt="DAPC Logo" 
          className="h-24 w-auto mb-4 object-contain" 
        />
        <h1 className="text-4xl font-black text-gray-900 text-center">
          Is Your Business Visible Online?
        </h1>
      </header>

      {/* Search Section */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-2xl flex gap-2">
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Enter your business name..."
            className="border-2 border-blue-100 p-4 w-full rounded-xl outline-none shadow-sm"
          />
          <button 
            onClick={handleSearch} 
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Run Audit
          </button>
        </div>
      </div>

      {/* Results rendering remains the same... */}
      {searchResult && (
         <div className="mb-12 p-8 bg-white border-2 border-blue-50 rounded-3xl shadow-xl">
           <h2 className="text-2xl font-bold">{searchResult.name} — {searchResult.score}/100</h2>
           {/* ... rest of result UI ... */}
         </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-3xl font-black text-center mb-10 text-gray-800">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-lg flex flex-col items-center text-center">
            {/* 2. FIXED ICON PATH & EXTENSION */}
            <img 
              src={`/icons/${plan.icon}.jpg`} 
              alt={plan.name} 
              className="h-28 w-28 object-contain mb-4" 
            />
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
            <p className="text-2xl font-black text-blue-600 mb-6">KES {plan.amount.toLocaleString()}</p>
            
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className="mt-auto w-full bg-green-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}