"use client";

import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  {
    name: "Starter Listing",
    price: 1999,
    description: "For small businesses",
  },
  {
    name: "Local Boost",
    price: 3999,
    description: "Increase actions",
  },
  {
    name: "Growth Engine",
    price: 5999,
    description: "Monthly leads",
  },
  {
    name: "Market Leader",
    price: 7999,
    description: "Lead competitors",
  },
  {
    name: "Super Active",
    price: 10000,
    description: "Global exposure",
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    console.log("SETTING PLAN:", plan); // ✅ DEBUG

    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="relative py-24 bg-white z-10">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-black text-center mb-10">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="p-6 border-2 rounded-2xl flex flex-col items-center bg-white shadow-sm hover:shadow-lg transition"
            >
              <h3 className="font-black text-center text-sm mb-2">
                {plan.name}
              </h3>

              <p className="text-gray-500 text-xs mb-4 text-center">
                {plan.description}
              </p>

              <p className="text-2xl font-black mb-6">
                KES {plan.price.toLocaleString()}
              </p>

              {/* ✅ DEBUG BUTTON */}
              <button
                type="button"
                onClick={() => {
                  console.log("PLAN CLICKED:", plan); // ✅ DEBUG
                  handleSelectPlan(plan);
                }}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-[10px] hover:bg-green-600 transition-all cursor-pointer"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ ALWAYS RENDER MODAL */}
      <MpesaModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log("MODAL CLOSED"); // ✅ DEBUG
          setIsModalOpen(false);
        }}
        planName={selectedPlan?.name}
        amount={selectedPlan?.price}
      />
    </section>
  );
}