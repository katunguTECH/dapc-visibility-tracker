"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const plans = [
  { name: "Starter Listing", price: 1999 },
  { name: "Local Boost", price: 3999 },
  { name: "Growth Engine", price: 5999 },
  { name: "Market Leader", price: 7999 },
  { name: "Super Active", price: 10000 },
];

export default function Pricing() {
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: any) => {
    console.log("CLICKED:", plan.name);

    // 🔐 Force sign-in FIRST (frontend only)
    if (!isSignedIn) {
      console.log("Redirecting to sign-in...");
      window.location.href = "/sign-in"; // ✅ Reliable fix
      return;
    }

    // 💰 Proceed with STK push
    console.log("User signed in → sending STK");

    setLoading(plan.name);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: "254712345678", // 🔥 replace later with real user input
          amount: plan.price,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ STK sent to your phone!");
      } else {
        alert("❌ Payment failed: " + data.message);
      }
    } catch (error) {
      console.error("STK error:", error);
      alert("❌ Error sending STK request");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-20 px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">
            Choose Your Growth Tier
          </h2>
          <p className="text-slate-500">
            Select a plan to fix the gaps found in your audit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-2xl p-6 text-center hover:border-blue-700 transition"
            >
              <h3 className="font-black mb-3 text-sm uppercase">
                {plan.name}
              </h3>

              <p className="text-2xl font-black text-blue-700 mb-6">
                KES {plan.price.toLocaleString()}
              </p>

              <button
                onClick={() => handleSubscribe(plan)}
                className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full hover:bg-black transition"
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
      </div>
    </section>
  );
}