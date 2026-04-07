"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: any) => {
    // 🔐 STEP 1: FORCE SIGN IN
    if (!isSignedIn) {
      openSignIn?.();
      return;
    }

    // 💰 STEP 2: TRIGGER MPESA (independent)
    setLoading(plan.name);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: "254712345678", // ⚠️ replace with real input later
          amount: plan.price
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("STK sent to your phone!");
      } else {
        alert("Payment failed");
      }

    } catch (err) {
      console.error(err);
      alert("Error sending STK");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 px-6 bg-white">
      <h2 className="text-3xl font-black text-center mb-10">
        Choose Your Growth Tier
      </h2>

      <div className="grid md:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 border rounded-2xl text-center">
            <img src={plan.icon} className="w-16 h-16 mx-auto mb-4 rounded-full" />
            <h3 className="font-bold mb-2">{plan.name}</h3>
            <p className="text-blue-700 font-black mb-6">
              KES {plan.price.toLocaleString()}
            </p>

            <button
              onClick={() => handleSubscribe(plan)}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
            >
              {loading === plan.name
                ? "Processing..."
                : isSignedIn
                ? "Subscribe"
                : "Sign In to Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}