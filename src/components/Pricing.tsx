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
    console.log("Plan selected, opening modal...");
    setSelectedPlan(plan);
    setIsModalOpen(true); // This makes the MpesaModal appear
  };

  return (
    <section id="pricing" className="relative py-24 bg-white z-[10]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 uppercase italic">Select Your Plan</h2>
          <p className="text-gray-500 font-bold mt-2 text-sm uppercase tracking-widest">Pricing for Digital Visibility Audits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className="p-8 border-2 border-gray-100 rounded-[2.5rem] flex flex-col items-center bg-white hover:border-green-500 transition-all">
              <img src={plan.icon} alt={plan.name} className="w-24 h-24 rounded-full mb-6 object-cover border-4 border-gray-50" />
              <h3 className="text-lg font-black text-center mb-2">{plan.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-6">{plan.description}</p>
              
              <div className="mt-auto w-full text-center">
                <p className="text-3xl font-black text-gray-900 mb-6">KES {plan.price.toLocaleString()}</p>
                <button 
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all"
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RENDER MODAL ONLY WHEN STATE IS TRUE */}
      {isModalOpen && (
        <MpesaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan?.name}
          amount={selectedPlan?.price}
        />
      )}
    </section>
  );
}