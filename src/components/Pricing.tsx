"use client";

import { useState } from "react";
import MpesaModal from "./MpesaModal";
import Image from "next/image";
import { useUser, useSignIn } from "@clerk/nextjs";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  return (
    <section className="py-10 px-4">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className="flex flex-col border p-6 rounded-3xl text-center bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            
            {/* ICON */}
            <div className="relative w-20 h-20 mx-auto mb-4 border-2 border-blue-50">
              <Image 
                src={plan.icon} 
                alt={plan.name} 
                fill 
                className="rounded-full object-cover" 
              />
            </div>

            {/* TITLE */}
            <h3 className="font-bold text-sm mb-2 text-gray-800">
              {plan.name}
            </h3>
            
            {/* PRICE */}
            <p className="text-blue-700 font-black mb-6 text-lg">
              KES {plan.price.toLocaleString()}
            </p>

            {/* BUTTON */}
            <button 
              onClick={() => {
                if (!isSignedIn) {
                  openSignIn?.();   // 🔐 force login
                  return;
                }

                setSelectedPlan(plan); // ✅ open modal ONLY if signed in
              }}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-xs font-bold transition-colors"
            >
              Subscribe with M-Pesa
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedPlan && (
        <MpesaModal 
          isOpen={true}
          onClose={() => setSelectedPlan(null)} 
          planName={selectedPlan.name} 
          amount={selectedPlan.price} 
        />
      )}
    </section>
  );
}