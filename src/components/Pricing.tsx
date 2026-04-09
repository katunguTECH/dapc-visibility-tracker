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
  { name: "Super Active", price: 10000, features: ["Full Visibility Suite"], icon: "/icons/superactivevisibility-lion.jpg" }, // FIXED ICON PATH
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10 px-4">
      {plans.map((plan) => (
        <div key={plan.name} className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl text-center hover:shadow-lg transition-shadow duration-300">
          <img 
            src={plan.icon} 
            alt={plan.name} 
            className="mx-auto mb-4 w-24 h-24 object-cover rounded-2xl" 
          />
          <h3 className="font-bold text-xl mb-1 tracking-tighter">{plan.name}</h3>
          <p className="text-blue-700 font-black text-lg mb-4">KES {plan.price.toLocaleString()}</p>
          <ul className="text-sm text-gray-500 mb-6 space-y-1">
            {plan.features.map(f => <li key={f}>{f}</li>)}
          </ul>
          <button
            className="w-full bg-blue-700 text-white py-3 px-4 rounded-xl font-bold hover:bg-blue-800 transition-colors"
            onClick={() => handleSubscribeClick(plan)}
          >
            Subscribe
          </button>
        </div>
      ))}

      {/* M-PESA Modal */}
      {showPhoneInput && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-green-600 font-bold text-2xl">M</span>
            </div>
            <h3 className="font-bold text-2xl mb-2">Lipa na M-PESA</h3>
            <p className="text-gray-500 mb-6 text-sm">Pay <strong>KES {currentPlan?.price}</strong> for {currentPlan?.name}</p>
            
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 254712345678"
              className="border-2 border-gray-200 p-4 w-full mb-6 rounded-2xl focus:border-green-500 outline-none transition-all text-center text-lg"
            />
            
            <div className="flex flex-col gap-3">
              <button
                onClick={sendSTK}
                className="bg-green-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-green-700 transition-colors text-lg"
              >
                Pay Now
              </button>
              <button
                onClick={() => setShowPhoneInput(false)}
                className="text-gray-400 py-2 font-medium hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}