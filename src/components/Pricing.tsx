"use client";

import { useState } from "react";

interface Plan {
  name: string;
  price: number;
  features: string[];
  icon: string;
}

const plans: Plan[] = [
  { name: "Starter Listing", price: 1999, features: ["Feature 1"], icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, features: ["Feature 2"], icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, features: ["Feature 3"], icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, features: ["Feature 4"], icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, features: ["Feature 5"], icon: "/icons/supervisibility-lion.jpg" },
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
    if (!phone || !currentPlan) return alert("Please enter your phone number!");
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: currentPlan.price }),
      });
      const data = await res.json();
      alert(data.message || "✅ STK sent to your phone!");
      setShowPhoneInput(false);
      setPhone("");
    } catch (err) {
      console.error("STK error:", err);
      alert("❌ Error sending STK request");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {plans.map((plan) => (
        <div key={plan.name} className="p-6 bg-white shadow rounded-xl text-center">
          <img src={plan.icon} alt={plan.name} className="mx-auto mb-4 w-20 h-20 object-cover rounded-full" />
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <p className="text-blue-700 font-bold mb-4">KES {plan.price}</p>
          <button
            className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
            onClick={() => handleSubscribeClick(plan)}
          >
            Subscribe
          </button>
        </div>
      ))}

      {showPhoneInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h3 className="font-bold mb-4">Enter Your Phone Number</h3>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="2547XXXXXXXX"
              className="border p-2 w-full mb-4 rounded"
            />
            <button
              onClick={sendSTK}
              className="bg-green-600 text-white py-2 px-4 rounded mr-2 hover:bg-green-700"
            >
              Pay
            </button>
            <button
              onClick={() => setShowPhoneInput(false)}
              className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

