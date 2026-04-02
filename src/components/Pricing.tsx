"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  {
    name: "Starter Listing",
    price: 1999,
    description: "Get found online with basic SEO",
    features: ["Google Business Setup", "Basic SEO Audit", "Map Pin Verification"],
    icon: "/icons/starter-cheetah.jpg", 
    color: "border-gray-100"
  },
  {
    name: "Local Boost",
    price: 3999,
    description: "Increase real customer actions",
    features: ["Competitor Analysis", "Keyword Optimization", "Weekly Reports"],
    icon: "/icons/boost-buffalo.jpg", 
    color: "border-green-500 shadow-xl lg:scale-110 z-10" 
  },
  {
    name: "Growth Engine",
    price: 5999,
    description: "Ready for consistent monthly leads",
    features: ["Full Pro Audit", "Monthly Backlinks", "Priority Support"],
    icon: "/icons/growthengine-rhino.jpg",
    color: "border-gray-100"
  },
  {
    name: "Market Leader",
    price: 9999,
    description: "Dominant search presence for your industry",
    features: ["Multi-location SEO", "Content Strategy", "Dedicated Account Manager"],
    icon: "/icons/marketleader-elephant.jpg",
    color: "border-gray-100"
  },
  {
    name: "Super Active Visibility",
    price: 14999,
    description: "Aggressive omnipresence across all platforms",
    features: ["Daily Optimization", "Social Media Sync", "24/7 Visibility Monitoring"],
    icon: "/icons/superactivevisibility-lion.jpg",
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
          <p className="text-gray-500 mt-4 text-lg font-medium">Scale your business visibility in Kenya</p>
        </div>

        {/* GRID SETTINGS:
            - grid-cols-1: Stacks cards on mobile so none are hidden.
            - md:grid-cols-2: Two per row on tablets.
            - xl:grid-cols-3: Three per row on desktop.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-[2.5rem] p-8 md:p-10 border-2 ${plan.color} flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Icon Container */}
              <div className="w-24 h-24 mb-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner">
                <img 
                  src={plan.icon} 
                  alt={plan.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 min-h-[3rem] flex items-center">
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
                    <span className="bg-green-100 text-green-600 rounded-full p-1 mr-3 mt-0.5 text-[10px] shrink-0">✔</span> 
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

      {/* The Modal remains controlled by Pricing state */}
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