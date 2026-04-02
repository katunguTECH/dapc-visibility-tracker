"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  // 1. Initialize step to 1 (The Phone Input)
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. The "Hard Reset" - This kills any old state when the modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format number to 254...
    let clean = phoneNumber.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "254" + clean.slice(1);
    if (clean.startsWith("7") || clean.startsWith("1")) clean = "254" + clean;

    if (clean.length !== 12) {
      alert("Please enter a valid number (e.g. 0712345678)");
      return;
    }

    setLoading(true);
    // Move to step 2 (Loading Spinner)
    setStep(2); 

    try {
      const res = await axios.post("/api/mpesa/stk-push", { 
        amount: Math.round(amount), 
        phoneNumber: clean, 
        planName 
      });
      
      if (res.data.success) {
        // ONLY move to step 3 (Awaiting PIN) if the API says "Success"
        setStep(3);
      } else {
        alert("M-Pesa Error: " + res.data.message);
        setStep(1);
      }
    } catch (err) {
      alert("Failed to connect to M-Pesa. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        
        {/* STEP 1: PHONE INPUT (This is what you are missing) */}
        {step === 1 && (
          <form onSubmit={handlePay} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900">M-Pesa Checkout</h2>
              <p className="text-gray-500 text-xs mt-1">{planName} — KES {amount}</p>
            </div>
            
            <input 
              required
              autoFocus
              type="tel"
              placeholder="07XXXXXXXX"
              className="w-full border-2 border-gray-200 p-4 rounded-2xl text-center text-xl font-bold focus:border-green-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <button 
              type="submit"
              className="bg-green-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest active:scale-95"
            >
              Send Payment Prompt
            </button>
          </form>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 2 && (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-bold">Contacting Safaricom...</p>
          </div>
        )}

        {/* STEP 3: AWAITING PIN */}
        {step === 3 && (
          <div className="text-center flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-green-600 border-t-transparent animate-spin rounded-full mb-6"></div>
            <h2 className="text-xl font-bold">Awaiting M-Pesa PIN</h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">Check your phone for the prompt.</p>
            <div className="w-full bg-gray-50 p-4 rounded-xl text-left text-xs text-gray-600">
              <p>Paybill: 516600</p>
              <p>Account: 0675749001</p>
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Cancel & Return
        </button>
      </div>
    </div>
  );
}