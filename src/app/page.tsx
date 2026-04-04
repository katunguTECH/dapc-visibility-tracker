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

const mockCompetitors = [
  { name: "Competitor A", score: 20 },
  { name: "Competitor B", score: 15 },
  { name: "Competitor C", score: 10 },
];

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!business) return alert("Please enter a business name");

    setLoading(true);
    setSearchResult(null);

    // Simulate audit delay for 1.5 seconds
    setTimeout(() => {
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
      setLoading(false);
    }, 1500);
  };

  const handlePay = async (planName: string, amount: number) => {
    // 1. Auth Guard
    if (!isLoaded || !userId) {
      alert("Please sign in to your DAPC account to proceed with payment.");
      router.push("/sign-in");
      return;
    }

    const phoneNumber = prompt(`Enter your Safaricom M-Pesa number for ${planName}:`);
    if (!phoneNumber) return;

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount, planName, userId }),
      });
      const data = await res.json();
      alert(data.message || "STK Push sent! Check your phone.");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header / Logo */}
      <header className="flex flex-col items-center mb-12 border-b pb-8">
        <img 
          src="/dapc-logo.jpg" 
          alt="DAPC Logo" 
          className="h-24 w-auto mb-4 object-contain" 
        />
        <h1 className="text-4xl font-black text-gray-900 text-center">
          Is Your Business Visible Online?
        </h1>
      </header>

      {/* Search Input Section */}
      <div className="mb-12 flex justify-center">
        <div className="w-full max-w-2xl flex gap-3">
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            disabled={loading}
            placeholder="Enter your business name (e.g. Safari Park Hotel)..."
            className="border-2 border-blue-100 p-4 w-full rounded-2xl outline-none shadow-sm focus:border-blue-500 transition-all disabled:bg-gray-50"
          />
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className={`flex items-center justify-center min-w-[160px] px-8 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Run Audit"
            )}
          </button>
        </div>
      </div>

      {/* Loading Animation Area */}
      {loading && (
        <div className="text-center py-12 animate-pulse">
          <p className="text-blue-600 font-black text-lg mb-4">Scanning digital footprint for {business}...</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </div>
      )}

      {/* Audit Results Dashboard */}
      {searchResult && !loading && (
        <div className="mb-16 p-8 bg-white border-2 border-blue-50 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-800">{searchResult.name}</h2>
              <p className="text-blue-600 font-bold text-lg">📍 {searchResult.location}, Kenya</p>
            </div>
            <div className="bg-red-50 px-6 py-4 rounded-3xl text-center border border-red-100">
              <span className="text-xs uppercase font-black text-red-400 tracking-widest">Visibility Score</span>
              <p className="text-6xl font-black text-red-600">{searchResult.score}<span className="text-2xl">/100</span></p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: 'Website', val: searchResult.website, icon: '🌐' },
              { label: 'Search', val: searchResult.search, icon: '🔍' },
              { label: 'Maps', val: searchResult.maps, icon: '📍' },
              { label: 'Social', val: searchResult.social, icon: '📱' },
              { label: 'SEO', val: searchResult.seo, icon: '⚙️' }
            ].map(item => (
              <div key={item.label} className="bg-gray-50 p-5 rounded-2xl text-center border border-gray-100 shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{item.label}</div>
                <div className="text-xl font-black text-gray-800">{item.val}/20</div>
              </div>
            ))}
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border-l-8 border-red-500">
            <h3 className="font-black text-red-800 mb-4 text-lg">⚠️ Critical Gaps Detected:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResult.gaps.map((gap: string) => (
                <li key={gap} className="flex items-center text-red-700 font-bold bg-white/50 p-3 rounded-xl">
                  <span className="mr-3">🚩</span> {gap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Subscription Plans Section */}
      <h2 className="text-4xl font-black text-center mb-4 text-gray-900">Subscription Plans</h2>
      <p className="text-center text-gray-500 mb-12">Choose a plan to fix your visibility gaps and dominate your local market.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-20">
        {plans.map((plan) => (
          <div key={plan.name} className="group p-8 bg-white border border-gray-100 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 transform -translate-y-full group-hover:translate-y-0 transition-transform"></div>
            
            <img 
              src={`/icons/${plan.icon}.jpg`} 
              alt={plan.name} 
              className="h-32 w-32 object-contain mb-6 transform group-hover:scale-110 transition-transform duration-500" 
            />
            
            <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
            <p className="text-gray-500 text-xs mb-6 h-10 leading-relaxed">{plan.description}</p>
            <p className="text-3xl font-black text-blue-600 mb-8">KES {plan.amount.toLocaleString()}</p>
            
            <button
              onClick={() => handlePay(plan.name, plan.amount)}
              className={`mt-auto w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-md active:scale-95 ${
                userId ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {userId ? "Pay with M-Pesa" : "Sign In to Pay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}