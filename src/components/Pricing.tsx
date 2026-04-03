"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999 },
  { name: "Local Boost", price: 3999 },
  { name: "Growth Engine", price: 5999 },
  { name: "Market Leader", price: 7999 },
  { name: "Super Active", price: 10000 },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6">
        {plans.map((plan) => (
          <div key={plan.name} className="p-6 border rounded-2xl text-center">
            <h3 className="font-black">{plan.name}</h3>
            <p className="text-2xl font-bold">KES {plan.price}</p>

            <button
              onClick={() => handleSelectPlan(plan)}
              className="mt-4 w-full py-3 bg-black text-white rounded-xl hover:bg-green-600"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPlan && (
        <MpesaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </section>
  );
}