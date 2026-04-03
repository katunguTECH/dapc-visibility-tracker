"use client";

import { useState } from "react";
import Pricing from "../components/Pricing";
import MpesaModal from "../components/MpesaModal";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleRunAudit = () => {
    if (!businessName || !location) {
      alert("Please enter both Business Name and Location.");
      return;
    }
    router.push(`/audit?business=${encodeURIComponent(businessName)}&location=${encodeURIComponent(location)}`);
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-16">
      {/* Hero Section */}
      <section className="text-center w-full max-w-xl mb-16">
        <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">DAPC</h1>
        <p className="text-3xl font-bold mb-8 animate-fade-in delay-150">Is Your Business Visible Online?</p>

        {/* Inputs inline with shadow */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center animate-fade-in delay-300">
          <input
            type="text"
            placeholder="Business Name (e.g., Airtel)"
            className="w-full sm:w-64 p-4 border-2 border-gray-300 rounded-lg text-black shadow-md focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location (e.g., Nairobi)"
            className="w-full sm:w-48 p-4 border-2 border-gray-300 rounded-lg text-black shadow-md focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={handleRunAudit}
            className="bg-green-600 hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg uppercase transition-all transform hover:scale-105"
          >
            Run Audit
          </button>
        </div>

        <p className="mt-4 text-gray-600 text-sm animate-fade-in delay-450">
          Unlock Full Pro Audit
        </p>
      </section>

      {/* Subscription Plans */}
      <Pricing onSubscribe={handleSubscribe} />

      {/* M-Pesa Modal */}
      {isModalOpen && selectedPlan && (
        <MpesaModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
        />
      )}
    </main>
  );
}