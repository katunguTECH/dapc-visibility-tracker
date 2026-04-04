// src/app/page.tsx
"use client";

import { useState } from "react";
import MpesaModal from "../components/MpesaModal";
import Image from "next/image";

const subscriptionPlans = [
  {
    name: "Starter Listing",
    price: 1999,
    description: "For small businesses getting started",
    icon: "/icons/starter-cheetah.png",
  },
  {
    name: "Local Boost",
    price: 3999,
    description: "Increase visibility & customer actions",
    icon: "/icons/boost-buffalo.png",
  },
  {
    name: "Growth Engine",
    price: 5999,
    description: "Generate consistent monthly leads",
    icon: "/icons/growthengine-rhino.png",
  },
  {
    name: "Market Leader",
    price: 7999,
    description: "Dominate competitors in your area",
    icon: "/icons/marketleader-elephant.png",
  },
  {
    name: "Super Active",
    price: 10000,
    description: "Maximum exposure & premium insights",
    icon: "/icons/supervisibility-lion.png",
  },
];

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showMpesa, setShowMpesa] = useState(false);

  // Dummy realistic scoring logic
  const generateScore = (name: string) => {
    if (!name || name.trim().length < 3) return 10 + Math.floor(Math.random() * 10);
    return 60 + Math.floor(Math.random() * 35);
  };

  const handleRunAudit = () => {
    if (!businessName) return alert("Enter a business name to run audit");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* DAPC Logo */}
      <div className="flex justify-center mb-8">
        <Image src="/dapc-logo.png" alt="DAPC Logo" width={200} height={60} />
      </div>

      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-4">Is Your Business Visible Online?</h1>

      {/* Search Form */}
      <div className="flex justify-center mb-8 gap-4">
        <input
          type="text"
          placeholder="Business Name (e.g., Safaricom)"
          className="p-2 border rounded w-64"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <input
          type="text"
          placeholder="City (e.g., Nairobi)"
          className="p-2 border rounded w-48"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={handleRunAudit}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition-all animate-pulse"
        >
          Run Audit
        </button>
      </div>

      {/* Audit Results */}
      {businessName && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold">
              {businessName} {city ? `— ${city}` : ""}
            </h2>
            <p className="mt-2 font-medium">
              Visibility Score: {generateScore(businessName)}/100
            </p>
            <ul className="mt-2 space-y-1">
              <li>🌐 Website: 20/20</li>
              <li>🔍 Search: 20/20</li>
              <li>📍 Maps: 18/20</li>
              <li>📱 Social: 18/20</li>
              <li>⚙️ SEO: 18/20</li>
            </ul>
            <button
              onClick={() => setShowMpesa(true)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Unlock Full Pro Audit
            </button>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white p-6 rounded shadow flex flex-col items-center"
          >
            <Image src={plan.icon} alt={plan.name} width={80} height={80} />
            <h3 className="text-xl font-bold mt-4">{plan.name}</h3>
            <p className="mt-2 text-gray-600">{plan.description}</p>
            <p className="mt-2 font-semibold">KES {plan.price.toLocaleString()}</p>
            <button
              onClick={() => {
                setSelectedPlan(plan);
                setShowMpesa(true);
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* MPesa Modal */}
      {showMpesa && selectedPlan && (
        <MpesaModal
          plan={selectedPlan}
          onClose={() => {
            setShowMpesa(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
}