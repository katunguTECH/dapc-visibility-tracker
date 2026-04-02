"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  {
    name: "Starter Listing",
    price: 1999,
    description: "For small or offline businesses",
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
    price: 7999,
    description: "Position ahead of competitors",
    features: ["Multi-location SEO", "Content Strategy", "Dedicated Account Manager"],
    icon: "/icons/marketleader-elephant.jpg",
    color: "border-gray-100"
  },
  {
    name: "Super Active",
    price: 10000,
    description: "Maximum global exposure",
    features: ["Daily Optimization", "Social Media Sync", "24/7 Visibility Monitoring"],
    icon: "/icons/superactivevisibility-lion.jpg",
    color: "border-gray-100"
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    console.log("Button Clicked for:", plan.name); // Check this in Browser Console
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="relative py-12 md:py-24 bg-white w-full overflow-visible">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Choose Your Growth Speed</h2>
          <p className="text-gray-500 mt-4 text-lg font-medium">Select a plan from our official rate card.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-[2.5rem] p-8 md:p-10 border-2 ${plan.color} flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl relative`}
            >
              <div className="w-24 h-24 mb-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100">
                <img 
                  src={plan.icon} 
                  alt={plan.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 min-h-[3rem] flex items-center">
                {plan.name}
              </h3>
              
              <p className="text-gray-400 text-sm mt-1 mb-4 h-10">{plan.description}</p>
              
              <div className="mb-8">
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
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className="w-full py-5 rounded-2xl border-2 border-gray-100 font-black text-gray-900 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all uppercase text-xs tracking-widest relative z-30 cursor-pointer active:scale-95"
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL MOUNTING POINT --- */}
      {isModalOpen && (
        <MpesaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan?.name}
          amount={selectedPlan?.price}
          onPaymentSuccess={() => window.location.href = '/dashboard'}
        />
      )}
    </section>
  );
}