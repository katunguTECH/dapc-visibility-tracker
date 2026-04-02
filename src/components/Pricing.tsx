"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (plan: any) => {
    console.log("Plan Clicked:", plan.name); // Check this in your browser console
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-20 bg-white z-10">
      <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="p-8 border-2 border-gray-100 rounded-[2.5rem] flex flex-col items-center bg-white shadow-sm">
              <img src={plan.icon} alt="" className="w-20 h-20 mb-4 rounded-full border shadow-inner" />
              <h3 className="text-xl font-extrabold text-gray-900">{plan.name}</h3>
              <p className="text-3xl font-black text-green-600 my-4">KES {plan.price.toLocaleString()}</p>
              
              <button 
                type="button"
                // CRITICAL: Force this button to be at the absolute top of the stack
                className="relative z-[9999] pointer-events-auto w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 active:scale-95 transition-all cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(plan);
                }}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RENDER MODAL OUTSIDE THE GRID FLOW */}
      {isModalOpen && (
        <MpesaModal 
          key={Date.now()} // Forces a fresh start every time
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan?.name}
          amount={selectedPlan?.price}
        />
      )}
    </section>
  );
}