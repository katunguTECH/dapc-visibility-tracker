"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const plans = [
  { name: "Starter Listing", amount: 1999, icon: "starter-cheetah", description: "For small businesses getting started" },
  { name: "Local Boost", amount: 3999, icon: "boost-buffalo", description: "Increase visibility & customer actions" },
  { name: "Growth Engine", amount: 5999, icon: "growthengine-rhino", description: "Generate consistent monthly leads" },
  { name: "Market Leader", amount: 7999, icon: "marketleader-elephant", description: "Dominate competitors in your area" },
  { name: "Super Active", amount: 10000, icon: "superactivevisibility-lion", description: "Maximum exposure & premium insights" },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!business) return alert("Enter your business name");
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
        gaps: ["Weak Google Maps presence", "Low search visibility", "Weak social media presence", "Poor SEO optimization"],
      });
      setLoading(false);
    }, 1200);
  };

  const handlePay = async (planName: string, amount: number) => {
    if (!isLoaded || !userId) {
      alert("Sign in to pay");
      router.push("/sign-in");
      return;
    }
    const phoneNumber = prompt(`Enter M-Pesa number for ${planName}:`);
    if (!phoneNumber) return;

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phoneNumber, amount, planName }),
      });
      const data = await res.json();
      alert(data.message || "STK Push sent!");
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="flex flex-col items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
          Is Your Business Visible Online?
        </h1>
      </header>

      {/* Search Input */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-3 w-full max-w-2xl">
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Enter business name (e.g. Safari Park Hotel)..."
            className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className={`px-6 py-3 rounded-xl font-bold text-white transition ${loading ? "bg-gray-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Run Audit"}
          </button>
        </div>
      </div>

      {/* Audit Result */}
      {searchResult && (
        <div className="bg-white shadow-md rounded-2xl p-6 mb-12 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">{searchResult.name}</h2>
              <p className="text-sm text-gray-500">📍 {searchResult.location}</p>
            </div>
            <div className="text-center bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              <span className="text-xs font-bold uppercase text-red-500">Visibility Score</span>
              <p className="text-3xl font-extrabold text-red-600">{searchResult.score}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {[
              { label: "Website", val: searchResult.website, icon: "🌐" },
              { label: "Search", val: searchResult.search, icon: "🔍" },
              { label: "Maps", val: searchResult.maps, icon: "📍" },
              { label: "Social", val: searchResult.social, icon: "📱" },
              { label: "SEO", val: searchResult.seo, icon: "⚙️" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100 shadow-sm">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">{item.label}</div>
                <div className="text-lg font-extrabold text-gray-800">{item.val}/20</div>
              </div>
            ))}
          </div>

          {/* Gaps */}
          <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500 text-sm">
            <h3 className="font-bold text-red-700 mb-2">⚠️ Critical Gaps:</h3>
            <ul className="list-disc list-inside">
              {searchResult.gaps.map((gap: string) => (
                <li key={gap} className="text-red-600">{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Subscription Plans</h2>
      <p className="text-center text-gray-500 mb-6">
        Choose a plan to fix your visibility gaps and dominate your local market.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col items-center text-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
            <img
              src={`/icons/${plan.icon}.jpg`}
              alt={plan.name}
              className="h-16 w-16 object-contain mb-2"
            />
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{plan.description}</p>
            <p className="font-extrabold text-blue-600 text-xl mb-3">KES {plan.amount.toLocaleString()}</p>
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className="w-full py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}