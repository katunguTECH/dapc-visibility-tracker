"use client";

import { useState } from "react";

interface Plan {
  name: string;
  price: number;
  features: string[];
  icon: string;
}

const plans: Plan[] = [
  { name: "Starter Listing", price: 1999, features: ["Local SEO Scan"], icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, features: ["Competitor Tracking"], icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, features: ["Social Media Audit"], icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, features: ["Market Intelligence"], icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Visibility", price: 10000, features: ["Full Visibility Suite"], icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [phone, setPhone] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

  const handleSubscribeClick = (plan: Plan) => {
    setCurrentPlan(plan);
    setShowPhoneInput(true);
  };

  const sendSTK = async () => {
    if (!phone || !currentPlan) return alert("Enter phone number");

    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = "254" + phone.slice(1);
    }

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: currentPlan.price,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ STK Push sent! Check your phone.");
      } else {
        alert("❌ Failed: " + (data.message || "Try again"));
      }

      setShowPhoneInput(false);
      setPhone("");
    } catch (err) {
      console.error(err);
      alert("❌ Error sending STK");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 border rounded-2xl text-center shadow">
            <img src={plan.icon} className="w-16 h-16 mx-auto mb-4 rounded-full" />
            <h3 className="font-bold">{plan.name}</h3>
            <p className="text-blue-600 font-bold">KES {plan.price}</p>

            <button
              onClick={() => handleSubscribeClick(plan)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* M-PESA MODAL */}
      {showPhoneInput && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h3 className="font-bold mb-4">Lipa na M-PESA</h3>

            <input
              type="text"
              placeholder="0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-3 w-full mb-4"
            />

            <button
              onClick={sendSTK}
              className="bg-green-600 text-white w-full py-3 rounded-lg"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
