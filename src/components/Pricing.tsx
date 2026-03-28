"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";

const plans = [
  {
    name: "Starter Listing",
    price: 999,
    description: "Basic visibility for new businesses",
    features: ["Google Business Setup", "Basic SEO Audit", "Map Pin Verification"],
    color: "border-blue-200"
  },
  {
    name: "Local Boost",
    price: 3999,
    description: "Increase real customer actions",
    features: ["Competitor Analysis", "Keyword Optimization", "Weekly Reports"],
    color: "border-green-500 shadow-lg"
  },
  {
    name: "Growth Engine",
    price: 5999,
    description: "Ready for consistent monthly leads",
    features: ["Full Pro Audit", "Monthly Backlinks", "Priority Support"],
    color: "border-blue-200"
  }
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    alert(`Success! You are now subscribed to ${selectedPlan?.name}`);
    // You can redirect to a 'thank-you' or 'dashboard' page here
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="text-gray-600 mt-2">Scale your business visibility in Kenya</p>
        </div>

        {/* RESPONSIVE GRID: 1 column on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white rounded-3xl p-8 border-2 ${plan.color} flex flex-col items-center text-center transition-transform hover:scale-105`}
            >
              {plan.name === "Growth Engine" && (
                 <div className="w-20 h-20 mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <img src="/rhino-icon.png" alt="Growth" className="w-12 h-12" />
                 </div>
              )}
              
              <h3 className="text-xl font-bold uppercase tracking-widest text-gray-800">
                {plan.name}
              </h3>
              <p className="text-gray-500 text-sm mt-2 h-10">
                {plan.description}
              </p>
              
              <div className="my-6">
                <span className="text-4xl font-black text-gray-900">KES {plan.price.toLocaleString()}</span>
              </div>

              <ul className="text-left w-full space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 text-sm">
                    <span className="text-green-500 mr-2">✔</span> {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSelectPlan(plan)}
                className="w-full py-4 rounded-xl border-2 border-blue-100 font-bold text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all uppercase text-xs tracking-widest"
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MPESA MODAL COMPONENT */}
      <MpesaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlan?.name}
        amount={selectedPlan?.price}
        onPaymentSuccess={handleSuccess}
      />
    </section>
  );
}