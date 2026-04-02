"use client";
import { useState, useEffect } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  { 
    name: "Starter Listing", 
    price: 1999, 
    description: "For small or offline businesses", 
    icon: "/icons/starter-cheetah.jpg" 
  },
  { 
    name: "Local Boost", 
    price: 3999, 
    description: "Increase real customer actions", 
    icon: "/icons/boost-buffalo.jpg" 
  },
  { 
    name: "Growth Engine", 
    price: 5999, 
    description: "Ready for consistent monthly leads", 
    icon: "/icons/growthengine-rhino.jpg" 
  },
  { 
    name: "Market Leader", 
    price: 7999, 
    description: "Position ahead of competitors", 
    icon: "/icons/marketleader-elephant.jpg" 
  },
  { 
    name: "Super Active", 
    price: 10000, 
    description: "Maximum global exposure", 
    icon: "/icons/superactivevisibility-lion.jpg" 
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debugging: This will show in your browser console if the script is alive
  useEffect(() => {
    console.log("Pricing Component Mounted & Active");
  }, []);

  const handleSelectPlan = (plan: any) => {
    console.log("Plan Clicked:", plan.name);
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="relative py-24 bg-white z-[50] isolate">
      <div className="container mx-auto px-6 relative z-[60]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4 uppercase italic tracking-tight">
            Choose Your Growth Speed
          </h2>
          <p className="text-gray-500 font-bold">
            Select a plan from our official rate card to unlock full visibility auditing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className="group p-8 border-2 border-gray-100 rounded-[2.5rem] flex flex-col items-center bg-white hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="relative mb-6">
                <img 
                  src={plan.icon} 
                  alt={plan.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-inner group-hover:scale-110 transition-transform"
                />
              </div>

              <h3 className="text-lg font-black text-gray-900 text-center mb-2 leading-tight">
                {plan.name}
              </h3>
              
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-4 h-8">
                {plan.description}
              </p>

              <div className="mt-auto w-full text-center">
                <p className="text-xs font-black text-gray-400 uppercase mb-1">KES</p>
                <p className="text-3xl font-black text-gray-900 mb-6">
                  {plan.price.toLocaleString()}
                </p>
                
                <button 
                  type="button"
                  // Use a massive z-index and pointer-events-auto to bypass Clerk/Loader overlays
                  className="relative z-[99999] pointer-events-auto w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-green-600 active:scale-95 transition-all shadow-lg cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectPlan(plan);
                  }}
                >
                  Select {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORCE RESET: key={Date.now()} 
          This ensures the MpesaModal is killed and reborn every time a plan is clicked.
          This stops the "Awaiting PIN" screen from showing up by accident.
      */}
      {isModalOpen && (
        <MpesaModal 
          key={Date.now()} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan?.name}
          amount={selectedPlan?.price}
        />
      )}
    </section>
  );
}