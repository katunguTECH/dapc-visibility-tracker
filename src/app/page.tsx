"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Search, Zap, Loader2, CheckCircle2 } from "lucide-react"; 
import { SignedIn, SignedOut, UserButton, useUser, useClerk } from "@clerk/nextjs";
import BusinessSearch from "../components/BusinessSearch";

// Updated plan data with your specific icon paths and branding
const DAPC_PLANS = [
  { name: "Starter Listing", price: 1999, description: "For small or offline businesses", icon: "/icons/starter-cheetah.jpg" },
  { name: "Local Boost", price: 3999, description: "Increase real customer actions", icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth Engine", price: 5999, description: "Ready for consistent monthly leads", icon: "/icons/growthengine-rhino.jpg" },
  { name: "Market Leader", price: 7999, description: "Position ahead of competitors", icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super Active", price: 10000, description: "Maximum global exposure", icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function LandingPage() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const [showPricing, setShowPricing] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedPlanName, setSelectedPlanName] = useState("");

  const handlePlanSelection = async (amount: number, planName: string) => {
    if (!user) {
      openSignIn({ afterSignInUrl: "/" });
      return;
    }

    setIsPaying(true);
    setSelectedAmount(amount);
    setSelectedPlanName(planName);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          phoneNumber: "phoneNumber", 
          planName: planName, // Critical: Passes the plan type to the backend
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setPaymentSuccess(true);
      } else {
        // Displays the specific error from your API instead of a generic connection error
        alert(`API Error: ${data.message || "Failed to initialize STK push"}`);
      }
    } catch (error: any) {
      // Detailed error for debugging connection issues
      alert(`Network Error: ${error.message}. Ensure your API route is reachable.`);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-10 py-8 max-w-7xl mx-auto">
        <div style={{ fontWeight: 950 }} className="text-4xl text-blue-600 italic tracking-tighter">DAPC</div>
        <div className="flex items-center gap-4">
          <SignedOut>
            <button onClick={() => openSignIn()} className="text-[11px] font-black uppercase tracking-widest bg-slate-900 text-white px-8 py-4 rounded-full">
              Sign In
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* LANDING PAGE CONTENT (SEARCH FIRST) */}
      <main className="max-w-7xl mx-auto py-20 px-6 text-center">
        <h1 style={{ fontWeight: 900 }} className="text-7xl md:text-8xl text-slate-950 tracking-tighter leading-none mb-6">
          Is Your Business <span className="text-blue-600 italic">Visible Online?</span>
        </h1>
        <div className="mb-12">
          <BusinessSearch />
        </div>
        <button 
          onClick={() => setShowPricing(true)} 
          className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl flex items-center gap-3 mx-auto"
        >
          <Zap size={20} fill="white" /> Unlock Full Pro Audit
        </button>
      </main>

      {/* PRICING & SUCCESS MODAL */}
      {showPricing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[60px] w-full max-w-6xl p-12 relative shadow-2xl my-8">
            <button 
              onClick={() => { setShowPricing(false); setPaymentSuccess(false); }} 
              className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"
            >
              <X size={40} />
            </button>
            
            {!paymentSuccess ? (
              <>
                <div className="text-center mb-12">
                  <h2 style={{ fontWeight: 900 }} className="text-5xl tracking-tighter mb-4">Choose Your Growth Speed</h2>
                  <p className="text-slate-400 font-bold text-lg">Select a plan from our official rate card.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {DAPC_PLANS.map((plan) => (
                    <div key={plan.name} className="group bg-slate-50 p-8 rounded-[45px] border-2 border-transparent hover:border-blue-600 transition-all flex flex-col items-center text-center">
                      <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image src={plan.icon} alt={plan.name} fill className="object-cover" />
                      </div>
                      <h3 style={{ fontWeight: 900 }} className="text-xl uppercase tracking-tighter mb-2">{plan.name}</h3>
                      <p className="text-slate-400 font-bold text-xs mb-6 px-4">{plan.description}</p>
                      <div className="mb-8">
                        <span className="text-3xl font-black text-slate-950">KES {plan.price.toLocaleString()}</span>
                      </div>
                      <button 
                        disabled={isPaying}
                        onClick={() => handlePlanSelection(plan.price, plan.name)}
                        className="w-full py-4 bg-white border-2 border-slate-200 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                      >
                        {isPaying && selectedAmount === plan.price ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={14} /> Initializing...
                          </div>
                        ) : (
                          `Select ${plan.name}`
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 text-green-600 p-8 rounded-full mb-8">
                  <CheckCircle2 size={80} />
                </div>
                <h2 style={{ fontWeight: 900 }} className="text-6xl text-slate-950 tracking-tighter mb-4">Awaiting M-Pesa Prompt</h2>
                <p className="text-slate-500 font-bold text-xl max-w-lg mx-auto mb-10">
                  Please check your phone for the M-Pesa PIN prompt to complete your {selectedPlanName} subscription.
                </p>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Manual Payment Backup</p>
                  <p className="text-2xl font-black text-slate-900">Paybill: 516600</p>
                  <p className="text-xl font-bold text-blue-600">Account: 0675749001</p>
                </div>
                <button 
                  onClick={() => setShowPricing(false)} 
                  className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-colors"
                >
                  Close and Return to Audit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <div 
        onClick={() => window.open("https://wa.me/phoneNumber")} 
        className="fixed bottom-10 right-10 z-[110] bg-[#25D366] text-white p-6 rounded-full shadow-2xl cursor-pointer hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} />
      </div>
    </div>
  );
}