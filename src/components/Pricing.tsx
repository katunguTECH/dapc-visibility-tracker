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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {plans.map((plan) => (
        <div key={plan.name} className="border border-slate-200 p-8 rounded-3xl text-center bg-white hover:shadow-xl transition-all group">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          </div>
          <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">{plan.name}</h3>
          <p className="text-xl font-black text-blue-700 my-4">KES {plan.price.toLocaleString()}</p>
          <button
            onClick={() => handleSubscribe(plan)}
            className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition"
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