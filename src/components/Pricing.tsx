"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  {
    name: "Starter Listing",
    price: 1999,
    description: "Get found online with basic SEO",
    features: ["Google Business Setup", "Basic SEO Audit", "Map Pin Verification"],
    icon: "/starter-cheetah.jpg", 
    color: "border-gray-100"
  },
  {
    name: "Local Boost",
    price: 3999,
    description: "Increase real customer actions",
    features: ["Competitor Analysis", "Keyword Optimization", "Weekly Reports"],
    icon: "/cheetah-icon.png", 
    color: "border-green-500 shadow-xl lg:scale-110 z-10" // Highlighted center card
  },
  {
    name: "Growth Engine",
    price: 5999,
    description: "Ready for consistent monthly leads",
    features: ["Full Pro Audit", "Monthly Backlinks", "Priority Support"],
    icon: "/rhino-icon.png",
    color: "border-gray-100"
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 md:py-24 bg-white w-full">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Choose Your Plan</h2>
          <p className="text-gray-500 mt-4 text-lg">Scale your business visibility in Kenya</p>
        </div>

        {/* CRITICAL FIX: 
            'grid-cols-1' forces them to stack vertically on mobile.
            'md:grid-cols-3' spreads them out only on larger screens.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-[2.5rem] p-8 md:p-10 border-2 ${plan.color} flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Icon Container */}
              <div className="w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100">
                <img 
                  src={plan.icon} 
                  alt={plan.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
                {plan.name}
              </h3>
              
              <div className="mt-4 mb-8">
                <span className="text-gray-900 text-4xl md:text-5xl font-black">
                  KES {plan.price.toLocaleString()}
                </span>
              </div>

              <ul className="text-left w-full space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-gray-500 font-semibold text-sm">
                    <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-0.5 text-[10px]">✔</span> 
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan)}
                className="w-full py-5 rounded-2xl border-2 border-gray-100 font-black text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase text-xs tracking-widest"
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <MpesaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan?.name}
        amount={selectedPlan?.price}
        onPaymentSuccess={() => window.location.href = '/dashboard'}
      />
    </section>
  );
}