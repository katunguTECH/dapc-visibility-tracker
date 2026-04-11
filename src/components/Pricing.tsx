"use client";

import { useState } from "react";

interface Plan {
  name: string;
  price: number;
  features: string[];
  icon: string;
}

const plans: Plan[] = [
  {
    name: "Starter Listing",
    price: 1999,
    features: ["Local SEO Scan"],
    icon: "/icons/starter-cheetah.jpg",
  },
  {
    name: "Local Boost",
    price: 3999,
    features: ["Competitor Tracking"],
    icon: "/icons/boost-buffalo.jpg",
  },
  {
    name: "Growth Engine",
    price: 5999,
    features: ["Social Media Audit"],
    icon: "/icons/growthengine-rhino.jpg",
  },
  {
    name: "Market Leader",
    price: 7999,
    features: ["Market Intelligence"],
    icon: "/icons/marketleader-elephant.jpg",
  },
  {
    name: "Super Visibility",
    price: 10000,
    features: ["Full Visibility Suite"],
    icon: "/icons/superactivevisibility-lion.jpg",
  },
];

export default function Pricing() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // 🟢 Open modal
  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // 🟢 Send STK Push
  const sendSTK = async () => {
    if (!phone || !selectedPlan) {
      alert("Enter phone number");
      return;
    }

    let formattedPhone = phone.trim();

    // normalize Kenyan format
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    }

    if (!formattedPhone.startsWith("254")) {
      alert("Use format 07XXXXXXXX or 254XXXXXXXXX");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: selectedPlan.price,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "STK failed");
      }

      alert("✅ STK sent! Check your phone.");
      setShowModal(false);
      setPhone("");
      setSelectedPlan(null);
    } catch (err: any) {
      console.error(err);
      alert("❌ Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">

      {plans.map((plan) => (
        <div
          key={plan.name}
          className="border rounded-2xl p-5 text-center shadow hover:shadow-lg transition"
        >
          <img
            src={plan.icon}
            alt={plan.name}
            className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
          />

          <h3 className="font-bold text-lg">{plan.name}</h3>

          <p className="text-blue-600 font-bold mb-2">
            KES {plan.price.toLocaleString()}
          </p>

          <ul className="text-sm text-gray-500 mb-4">
            {plan.features.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan)}
            className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold"
          >
            Subscribe
          </button>
        </div>
      ))}

      {/* 🔥 M-PESA MODAL */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center">

            <h2 className="font-bold text-lg mb-2">
              Pay KES {selectedPlan.price}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              {selectedPlan.name}
            </p>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0712345678"
              className="border p-3 w-full rounded-lg mb-4"
            />

            <button
              onClick={sendSTK}
              disabled={loading}
              className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending..." : "Pay Now"}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="text-sm text-gray-500 mt-3"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}