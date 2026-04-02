"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { name: "Starter Listing", price: 1999, description: "Small business setup", icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, description: "Increase actions", icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, description: "Monthly leads", icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, description: "Position ahead", icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, description: "Global exposure", icon: "/icons/superactivevisibility-lion.jpg" }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openPayment = (plan: any) => {
    console.log("Forcing Modal Open for:", plan.name);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-20 bg-white z-[50]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="p-8 border-2 border-gray-100 rounded-[2rem] flex flex-col items-center">
              <img src={plan.icon} className="w-20 h-20 mb-4 rounded-full" alt={plan.name} />
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-2xl font-black my-4">KES {plan.price}</p>
              
              <button 
                type="button"
                // onClick is now super simple and has zero logic outside this file
                onClick={(e) => {
                  e.preventDefault();
                  openPayment(plan);
                }}
                // This ensures the button is ALWAYS on top of everything else
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest z-[9999] cursor-pointer pointer-events-auto active:scale-95"
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <MpesaModal 
          key={selectedPlan?.name || "mpesa-modal"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan?.name}
          amount={selectedPlan?.price}
        />
      )}
    </section>
  );
}