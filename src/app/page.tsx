"use client";

import React, { useState } from "react";
import { Loader2, MessageCircle, Zap } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

// 1. DEFINE THIS OUTSIDE THE COMPONENT AT THE TOP
const DAPC_PLANS = [
  { name: "Starter Listing", price: 1999, description: "For small or offline businesses", icon: "🐆" },
  { name: "Local Boost", price: 3999, description: "Increase real customer actions", icon: "🐂" },
  { name: "Growth Engine", price: 5999, description: "Ready for consistent monthly leads", icon: "🦏" },
  { name: "Market Leader", price: 7999, description: "Position ahead of competitors", icon: "🐘" },
  { name: "Super Active", price: 10000, description: "Maximum global exposure", icon: "🦁" },
];

// ... (Keep your LoadingOverlay component here)

export default function LandingPage() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [isPaying, setIsPaying] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handlePayment = async (amount: number) => {
    if (!user) {
      openSignIn();
      return;
    }

    setIsPaying(true);
    setSelectedAmount(amount);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: "254722973020", 
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setIsPaying(false);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      setIsPaying(false);
      alert("Failed to initialize payment.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900">
      {/* ... Your Nav ... */}

      <main className="max-w-7xl mx-auto py-20 px-6">
        {/* ... Hero Section ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DAPC_PLANS.map((plan) => (
            <div key={plan.name} className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-5xl mb-6">{plan.icon}</div>
                <h3 className="font-black text-2xl mb-2">{plan.name}</h3>
                <p className="text-slate-400 font-bold text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-slate-400 font-bold">KES</span>
                  <span className="text-5xl font-black">{plan.price.toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={() => handlePayment(plan.price)}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}