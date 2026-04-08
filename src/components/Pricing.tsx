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

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (plan: any) => {
    console.log("CLICKED:", plan.name);

    if (!isSignedIn) {
      console.log("Opening sign-in...");
      openSignIn?.();
      return;
    }

    setSelectedPlan(plan);
  };

  const sendSTK = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          amount: selectedPlan.price,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON response:", text);
        throw new Error("Server returned invalid JSON");
      }

      if (data.success) {
        alert("✅ STK sent to your phone!");
        setSelectedPlan(null);
        setPhone("");
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (err) {
      console.error("STK error:", err);
      alert("❌ Error sending STK");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="font-bold mb-2">{plan.name}</h3>
            <p className="text-xl font-bold mb-4">KES {plan.price}</p>

            <button
              onClick={() => handleClick(plan)}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
            >
              {isSignedIn ? "Subscribe" : "Sign In to Subscribe"}
            </button>
          </div>
        ))}
      </div>

      {/* PHONE MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-xl">
            <h3 className="font-bold mb-4 text-center">
              Enter M-Pesa Number
            </h3>

            <input
              type="text"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <button
              onClick={sendSTK}
              disabled={loading}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              {loading ? "Processing..." : `Pay KES ${selectedPlan.price}`}
            </button>

            <button
              onClick={() => setSelectedPlan(null)}
              className="mt-3 text-sm text-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}