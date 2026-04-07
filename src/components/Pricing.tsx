"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

const plans = [
  { name: "Starter Listing", price: 1999 },
  { name: "Local Boost", price: 3999 },
  { name: "Growth Engine", price: 5999 },
  { name: "Market Leader", price: 7999 },
  { name: "Super Active", price: 10000 },
];

export default function Pricing() {
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useSignIn();

  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: any) => {
    console.log("CLICKED:", plan.name);

    // 🚨 WAIT FOR CLERK
    if (!isLoaded) {
      console.log("Clerk not loaded yet");
      return;
    }

    // 🔐 FORCE SIGN IN
    if (!isSignedIn) {
      console.log("Opening sign-in...");
      await openSignIn?.();
      return;
    }

    // 💰 STK PUSH
    setLoading(plan.name);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: "254712345678", // replace later
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
    <div className="grid md:grid-cols-5 gap-6 p-10">
      {plans.map((plan) => (
        <div key={plan.name} className="border p-6 rounded-xl text-center">
          <h3 className="font-bold mb-2">{plan.name}</h3>

          <p className="text-blue-700 font-black mb-4">
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
  );
}