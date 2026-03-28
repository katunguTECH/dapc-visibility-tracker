"use client";
import { useState } from "react";
import MpesaModal from "@/components/MpesaModal"; // Adjust path if needed

export default function AuditResultsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false); // Tracks if user paid

  // This function runs when the Modal confirms the payment in the DB
  const handlePaymentSuccess = () => {
    setIsUnlocked(true);
    console.log("Audit Unlocked! Showing full data...");
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* 1. THE AUDIT HEADER */}
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Business Visibility Audit</h1>
        <p className="text-gray-500">Analysis for: yourbusiness.co.ke</p>
      </div>

      {/* 2. THE CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-4">
        
        {/* FREE DATA (Always Visible) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
          <h2 className="font-bold text-xl mb-4">Basic Visibility Score</h2>
          <div className="text-4xl font-black text-blue-600">65/100</div>
        </div>

        {/* PRO DATA (Blurred if not unlocked) */}
        <div className="relative">
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-2xl border-2 border-dashed border-green-200 p-8 text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Unlock Pro Insights</h3>
              <p className="text-gray-600 mb-6 max-w-xs">
                See your competitor rankings, keyword gaps, and Google Maps optimization score.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl transition-all scale-105 active:scale-95"
              >
                Unlock Full Pro Audit
              </button>
            </div>
          )}

          {/* THE ACTUAL DATA (Blurred behind the overlay) */}
          <div className={`space-y-6 ${!isUnlocked ? 'filter blur-lg select-none pointer-events-none' : ''}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg text-green-700">Competitor Keyword Gap</h3>
              <p className="mt-2 text-gray-600">You are missing 14 high-traffic keywords used by your top 3 competitors.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-lg text-green-700">Google Maps Optimization</h3>
              <p className="mt-2 text-gray-600">Your profile is 45% optimized. Missing 3 key service categories.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THE MPESA MODAL */}
      <MpesaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        planName="Local Boost"
        amount={1} // Keep as 1 for testing (KES)
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}