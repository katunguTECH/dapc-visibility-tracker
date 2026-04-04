// src/app/page.tsx
"use client";

import { useState } from "react";

const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah", description: "For small businesses getting started" },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo", description: "Increase visibility & customer actions" },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino", description: "Generate consistent monthly leads" },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant", description: "Dominate competitors in your area" },
  { name: "Super Active", amount: 10000, icon: "supervisibility-lion", description: "Maximum exposure & premium insights" },
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

    // Simulate realistic scores
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
      alert(data.message || "STK Push sent! Check your phone to complete payment.");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header / Logo */}
      <header className="flex items-center mb-8">
        <img src="/dapc-logo.png" alt="DAPC Logo" className="h-16 mr-4" />
        <h1 className="text-3xl font-bold">Is Your Business Visible Online?</h1>
      </header>

      {/* Search */}
      <div className="mb-12">
        <input
          type="text"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Enter your business name..."
          className="border p-2 w-full max-w-md rounded mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Run Audit
        </button>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className="mb-12 p-6 border rounded shadow">
          <h2 className="text-xl font-bold">{searchResult.name} — {searchResult.location}</h2>
          <p className="text-gray-600 font-semibold">Business Visibility Audit</p>
          <p className="text-2xl font-bold my-2">{searchResult.score}/100 Visibility Score</p>
          <div className="grid grid-cols-5 gap-4 my-4 text-center">
            <div>🌐 Website: {searchResult.website}/20</div>
            <div>🔍 Search: {searchResult.search}/20</div>
            <div>📍 Maps: {searchResult.maps}/20</div>
            <div>📱 Social: {searchResult.social}/20</div>
            <div>⚙️ SEO: {searchResult.seo}/20</div>
          </div>
          <div className="text-red-600 font-semibold">
            {searchResult.gaps.map((gap: string) => <div key={gap}>⚠️ {gap}</div>)}
          </div>
          <h3 className="mt-4 font-semibold">Competitor Comparison</h3>
          <ul className="list-disc ml-6">
            {searchResult.competitors.map((c) => (
              <li key={c.name}>{c.name} — {c.score}/100</li>
            ))}
          </ul>
        </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-2xl font-bold mb-4">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 border rounded shadow text-center">
            <img src={`/icons/${plan.icon}.png`} alt={plan.name} className="h-24 mx-auto mb-2" />
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-gray-600 mb-2">{plan.description}</p>
            <p className="text-2xl font-bold mb-4">KES {plan.amount}</p>
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}