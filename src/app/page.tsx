"use client";

import { useState } from "react";
import Image from "next/image";

const subscriptionPlans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.png", description: "For small businesses getting started" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.png", description: "Increase visibility & customer actions" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.png", description: "Generate consistent monthly leads" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.png", description: "Dominate competitors in your area" },
  { name: "Super Active", price: 10000, icon: "/icons/supervisibility-lion.png", description: "Maximum exposure & premium insights" },
];

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [mpesaPhone, setMpesaPhone] = useState("");

  const handleRunAudit = () => {
    // Fake realistic scoring
    const score = Math.floor(Math.random() * 50) + (search ? 30 : 10);
    const gaps = score < 50 ? ["Weak Google Maps presence","Low search visibility","Weak social media presence","Poor SEO optimization"] : [];
    setAuditResult({
      name: search || "Unknown Business",
      location: "Nairobi",
      score,
      website: Math.min(score, 20),
      search: Math.min(score, 20),
      maps: Math.min(score, 20),
      social: Math.min(score, 20),
      seo: Math.min(score, 20),
      gaps,
    });
  };

  const handlePay = async (plan: typeof subscriptionPlans[0]) => {
    if (!mpesaPhone) {
      alert("Enter your M-Pesa number");
      return;
    }

    const res = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: mpesaPhone, amount: plan.price, planName: plan.name }),
    });

    const data = await res.json();
    if (data.success) alert("STK Push sent! Check your phone to complete the payment.");
    else alert("Payment failed. Try again.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* DAPC Logo */}
      <div className="flex justify-center my-4">
        <Image src="/dapc-logo.png" width={200} height={80} alt="DAPC Logo" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-4">Is Your Business Visible Online?</h1>

      {/* Business Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter your business name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          onClick={handleRunAudit}
          className="ml-2 bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          Run Audit
        </button>
      </div>

      {/* Audit Result */}
      {auditResult && (
        <div className="bg-white p-4 rounded shadow max-w-3xl mx-auto mb-6">
          <h2 className="text-xl font-semibold">{auditResult.name} — {auditResult.location}</h2>
          <p className="text-lg font-bold my-2">{auditResult.score}/100 Visibility Score</p>
          <div className="grid grid-cols-5 text-center mb-4">
            <div>🌐 Website: {auditResult.website}/20</div>
            <div>🔍 Search: {auditResult.search}/20</div>
            <div>📍 Maps: {auditResult.maps}/20</div>
            <div>📱 Social: {auditResult.social}/20</div>
            <div>⚙️ SEO: {auditResult.seo}/20</div>
          </div>
          {auditResult.gaps.length > 0 && (
            <div className="text-red-600 mb-2">
              <ul>
                {auditResult.gaps.map((gap, i) => <li key={i}>⚠️ {gap}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Subscription Plans */}
      <h2 className="text-2xl font-bold text-center mb-4">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {subscriptionPlans.map((plan, i) => (
          <div key={i} className="bg-white rounded shadow p-4 text-center">
            <Image src={plan.icon} width={80} height={80} alt={plan.name} className="mx-auto mb-2" />
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mb-2">{plan.description}</p>
            <p className="font-bold mb-2">KES {plan.price}</p>
            <input
              type="text"
              placeholder="07XXXXXXXX"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <button
              onClick={() => handlePay(plan)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Pay with M-Pesa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}