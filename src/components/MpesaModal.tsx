"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  // 1. We use a simple 'step' number to control the UI
  // 1 = Phone Input, 2 = Loading, 3 = Awaiting PIN
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. This is the "Nuclear Reset" - every time isOpen changes, we FORCE step 1
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep(2); // Move to loading spinner
    
    try {
      const res = await axios.post("/api/mpesa/stk-push", { amount, phoneNumber, planName });
      if (res.data.success) {
        setStep(3); // ONLY now move to "Awaiting PIN"
      } else {
        alert("M-Pesa Error: " + res.data.message);
        setStep(1);
      }
    } catch (err) {
      alert("Request failed. Please check your connection.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        
        {/* STEP 1: THE INPUT FIELD */}
        {step === 1 && (
          <form onSubmit={handlePay} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">M-Pesa Checkout</h2>
              <p className="text-gray-500 text-xs mt-1">Plan: {planName} (KES {amount})</p>
            </div>
            
            <input 
              required
              id="mpesa-number-input"
              name="mpesa-number"
              type="tel"
              placeholder="07XXXXXXXX"
              className="w-full border-2 border-gray-200 p-4 rounded-2xl text-center text-xl font-bold focus:border-green-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <button 
              type="submit"
              className="bg-green-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Send Payment Prompt
            </button>
          </form>
        )}

        {/* STEP 2: LOADING SPINNER */}
        {step === 2 && (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-bold">Contacting Safaricom...</p>
          </div>
        )}

        {/* STEP 3: AWAITING PIN */}
        {step === 3 && (
          <div className="text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <div className="h-8 w-8 border-4 border-green-600 border-t-transparent animate-spin rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold">Awaiting M-Pesa PIN</h2>
            <p className="text-gray-500 text-sm mt-2 mb-6">Check your phone for the pop-up prompt.</p>
            
            <div className="w-full bg-gray-50 p-4 rounded-xl text-left text-xs text-gray-600 space-y-1">
              <p className="font-black text-gray-400 uppercase">Manual Backup</p>
              <p>Paybill: <strong>516600</strong></p>
              <p>Account: <strong>0675749001</strong></p>
            </div>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="w-full mt-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
}