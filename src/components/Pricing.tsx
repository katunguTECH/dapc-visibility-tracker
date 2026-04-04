// src/components/Pricing.tsx
"use client";

import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.png" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.png" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.png" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.png" },
  { name: "Super Active", price: 10000, icon: "/icons/supervisibility-lion.png" },
];

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <div key={plan.name} className="border p-4 rounded-lg text-center">
          <img src={plan.icon} alt={plan.name} className="mx-auto h-16 mb-2" />
          <h3 className="font-bold">{plan.name}</h3>
          <p>KES {plan.price}</p>
          <button
            onClick={() => handleSubscribe(plan)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
          >
            Subscribe
          </button>
        </div>
      ))}

      {selectedPlan && (
        <MpesaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </div>
  );
}