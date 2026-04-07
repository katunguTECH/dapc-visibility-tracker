// src/components/Pricing.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<null | typeof plans[0]>(null);

  return (
    <section className="py-10 px-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col border p-6 rounded-3xl text-center bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Animal Icon */}
            <div className="relative w-24 h-24 mx-auto mb-4 border-2 border-blue-50 rounded-full overflow-hidden">
              <Image
                src={plan.icon}
                alt={plan.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Plan Name & Price */}
            <h3 className="font-bold text-sm mb-2 text-gray-800 h-10 flex items-center justify-center">
              {plan.name}
            </h3>
            <p className="text-blue-700 font-black mb-6 text-lg">
              KES {plan.price.toLocaleString()}
            </p>

            {/* Subscribe Button */}
            <button
              onClick={() => setSelectedPlan(plan)}
              className="mt-auto w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-xs font-bold transition-colors"
            >
              Subscribe with M-Pesa
            </button>
          </div>
        ))}
      </div>

      {/* M-Pesa Modal */}
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