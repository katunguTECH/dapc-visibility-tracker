"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming shadcn/ui or use a standard <input>

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!agreed || !user) return;
    setLoading(true);

    try {
      // Update Clerk Metadata
      await user.update({
        publicMetadata: { termsAccepted: true, acceptedAt: new Date().toISOString() }
      });
      
      // Force a session refresh so middleware sees the update
      await user.reload();
      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving consent:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-20 px-6">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-black italic tracking-tighter text-blue-600">DAPC CONSENT</h1>
        
        <div className="h-96 overflow-y-scroll border border-slate-200 p-6 rounded-2xl bg-slate-50 text-sm leading-relaxed text-slate-600">
          <h2 className="font-bold mb-4">DRIVE AFRICA PERFORMANCE CENTRE (DAPC) - TERMS & CONDITIONS</h2>
          <p className="mb-4">1. BINDING AGREEMENT: By clicking "I Agree", you acknowledge that you are authorized to act on behalf of your business entity...</p>
          {/* ... Insert full refined T&Cs here ... */}
        </div>

        <div className="flex items-start gap-3 bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <input 
            type="checkbox" 
            id="terms" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
          <label htmlFor="terms" className="text-sm font-semibold text-slate-700">
            I confirm that I have read, understood, and agree to the DAPC Terms and Conditions and Privacy Policy. I understand that subscription is conditional upon this consent.
          </label>
        </div>

        <button
          onClick={handleAccept}
          disabled={!agreed || loading}
          className={`w-full py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
            agreed ? "bg-slate-900 text-white hover:bg-blue-600" : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Accept & Proceed to Dashboard"}
        </button>
      </div>
    </div>
  );
}