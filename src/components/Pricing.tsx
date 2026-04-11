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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);

  const openModal = (plan: Plan) => {
    setSelected(plan);
    setOpen(true);
  };

  const sendSTK = async () => {
    if (!selected) return;
    if (!phone) return alert("Enter phone number");

    let formatted = phone.trim();
    if (formatted.startsWith("0")) {
      formatted = "254" + formatted.slice(1);
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatted,
          amount: selected.price,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "STK failed");
      }

      alert("✅ STK sent to phone");
      setOpen(false);
      setPhone("");
      setSelected(null);
    } catch (err: any) {
      alert("❌ Payment error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className="border rounded-xl p-5 text-center shadow"
        >
          <img
            src={plan.icon}
            alt={plan.name}
            className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
          />

          <h3 className="font-bold">{plan.name}</h3>

          <p className="text-blue-600 font-bold">
            KES {plan.price.toLocaleString()}
          </p>

          <button
            onClick={() => openModal(plan)}
            className="mt-4 bg-blue-600 text-white w-full py-2 rounded-lg"
          >
            Subscribe
          </button>
        </div>
      ))}

      {/* MODAL */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h2 className="font-bold mb-2">{selected.name}</h2>
            <p className="mb-4">KES {selected.price}</p>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              className="border p-3 w-full mb-4 rounded"
            />

            <button
              onClick={sendSTK}
              disabled={loading}
              className="bg-green-600 text-white w-full py-3 rounded"
            >
              {loading ? "Sending..." : "Pay Now"}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="text-sm mt-3 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
