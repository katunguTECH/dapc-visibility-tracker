"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";
import Image from "next/image";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {plans.map((plan) => (
        <div key={plan.name} className="border p-6 rounded-3xl text-center bg-white shadow-sm">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover" />
          </div>
          <h3 className="font-bold text-sm mb-2">{plan.name}</h3>
          <p className="text-blue-700 font-black mb-4">KES {plan.price.toLocaleString()}</p>
          <button 
            onClick={() => setSelectedPlan(plan)}
            className="w-full bg-blue-700 text-white py-2 rounded-xl text-xs font-bold"
          >
            Subscribe
          </button>
        </div>
      ))}
      {selectedPlan && (
        <MpesaModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} planName={selectedPlan.name} amount={selectedPlan.price} />
      )}
    </div>
  );
}