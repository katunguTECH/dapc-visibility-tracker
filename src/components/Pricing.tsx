"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999, description: "For small businesses", icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, description: "Increase actions", icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, description: "Monthly leads", icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, description: "Lead competitors", icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, description: "Global exposure", icon: "/icons/superactivevisibility-lion.jpg" }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    // 1. Set the plan data
    setSelectedPlan(plan);
    // 2. Open the Modal (This is the POPUP)
    setIsModalOpen(true); 
  };

  return (
    <section id="pricing" className="relative py-24 bg-white z-[10]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="p-6 border-2 rounded-[2rem] flex flex-col items-center bg-white shadow-sm">
              <img src={plan.icon} className="w-20 h-20 rounded-full mb-4" alt={plan.name} />
              <h3 className="font-black text-center text-sm mb-2">{plan.name}</h3>
              <p className="text-2xl font-black mb-6">KES {plan.price.toLocaleString()}</p>
              
              <button 
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className="w-full py-4 bg-black text-white rounded-xl font-bold uppercase text-[10px] hover:bg-green-600 transition-all cursor-pointer"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* THE POPUP UI */}
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