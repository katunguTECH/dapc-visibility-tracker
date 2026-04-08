"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

interface PricingProps {
  isSignedIn: boolean;
}

const plans = [
  { name: "Starter Listing", price: 1999 },
  { name: "Local Boost", price: 3999 },
  { name: "Growth Engine", price: 5999 },
  { name: "Market Leader", price: 7999 },
  { name: "Super Active", price: 10000 },
];

export default function Pricing({ isSignedIn }: PricingProps) {
  const { openSignIn } = useSignIn();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName: string, planPrice: number) => {
    if (!isSignedIn) {
      openSignIn?.();
      return;
    }

    const phoneNumber = prompt("Enter your phone number (e.g. 2547XXXXXXXX):");
    if (!phoneNumber) return;

    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, amount: planPrice, phone: phoneNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ STK sent to your phone!");
      } else {
        console.error("STK error:", data);
        alert("❌ STK request failed. Check console for details.");
      }
    } catch (err) {
      console.error("STK fetch error:", err);
      alert("❌ STK request failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.name} className="bg-white shadow-lg rounded-3xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-lg font-semibold mb-4">KES {plan.price}</p>
          <button
            onClick={() => handleSubscribe(plan.name, plan.price)}
            disabled={loading}
            className="bg-blue-700 text-white px-6 py-2 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Sign In to Subscribe"}
          </button>
        </div>
      ))}
    </div>
  );
}
