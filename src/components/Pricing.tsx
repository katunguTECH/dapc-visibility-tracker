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
    <section className="py-10 px-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col items-center border p-6 rounded-3xl shadow-sm hover:shadow-md">
            <div className="relative w-20 h-20 mb-4 border-2 border-blue-50 rounded-full">
              <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover" />
            </div>

            <h3 className="font-bold text-sm mb-2">{plan.name}</h3>
            <p className="text-blue-700 font-black text-lg mb-4">KES {plan.price.toLocaleString()}</p>

            <button
              onClick={() => setSelectedPlan(plan)}
              className="w-full py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800"
            >
              Subscribe with M-Pesa
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPlan && (
        <MpesaModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </section>
  );
}