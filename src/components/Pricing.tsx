"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

interface PricingProps {
  isSignedIn: boolean;
}

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing({ isSignedIn }: PricingProps) {
  const { openSignIn } = useSignIn();
  const { user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, planPrice: number) => {
    if (!isSignedIn) {
      openSignIn?.();
      return;
    }

    setLoadingPlan(planName);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user?.phoneNumber || "",
          amount: planPrice,
        }),
      });

      const data = await res.json();
      if (data.success) alert(`STK Push sent for ${planName}!`);
      else alert("Failed to send payment request. Try again.");
    } catch (err) {
      console.error(err);
      alert("Error processing payment.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="bg-white py-32 px-10 border-t border-slate-100">
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Choose Your Growth Tier</h2>
        <p className="text-slate-500 font-medium">Select a plan to fix the gaps found in your audit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-[2rem] p-6 border border-slate-200 flex flex-col items-center hover:border-blue-700 transition-all">
            <img src={plan.icon} alt={plan.name} className="w-16 h-16 mb-6 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
            <h3 className="text-[10px] font-black text-slate-900 text-center uppercase mb-4 tracking-tighter">{plan.name}</h3>
            <p className="text-xl font-black text-blue-700 mb-10">KES {plan.price}</p>
            
            <button
              onClick={() => handleSubscribe(plan.name, plan.price)}
              disabled={loadingPlan === plan.name}
              className="bg-blue-700 text-white px-6 py-3 rounded-xl font-black hover:bg-black transition disabled:opacity-50"
            >
              {loadingPlan === plan.name ? "Processing..." : "Sign In to Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}