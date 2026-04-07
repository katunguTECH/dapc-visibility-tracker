"use client";
import { useState } from "react";
import MpesaModal from "./MpesaModal";
import Image from "next/image";

const plans = [
  { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<null | typeof plans[0]>(null);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">

        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border p-6 rounded-3xl text-center bg-white shadow hover:shadow-lg transition"
          >
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={plan.icon}
                alt={plan.name}
                fill
                className="rounded-full object-cover"
              />
            </div>

            <h3 className="font-bold mb-2">{plan.name}</h3>

            <p className="text-blue-700 font-black mb-6">
              KES {plan.price.toLocaleString()}
            </p>

            <button
              onClick={() => {
                console.log("Clicked:", plan.name); // DEBUG
                setSelectedPlan(plan);
              }}
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800"
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