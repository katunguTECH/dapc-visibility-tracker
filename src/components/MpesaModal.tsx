"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  // Step 1: Input Phone, Step 2: Processing, Step 3: Awaiting PIN
  const [step, setStep] = useState(1); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Force reset the modal to the input screen every time it is opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Clean the number: Remove all non-digits
    let cleanNumber = phoneNumber.replace(/\D/g, ""); 
    
    // 2. Format to 254... requirement for Safaricom
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "254" + cleanNumber.slice(1);
    } else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
      cleanNumber = "254" + cleanNumber;
    }

    if (cleanNumber.length !== 12) {
      alert("Please enter a valid Kenyan number (e.g., 0712345678)");
      return;
    }

    setLoading(true);
    setStep(2); // Move to "Sending Prompt" loading state
    
    try {
      // Send the dynamic customer number to the backend
      const res = await axios.post("/api/mpesa/stk-push", { 
        amount: Math.round(amount), 
        phoneNumber: cleanNumber, 
        planName 
      });
      
      if (res.data.success) {
        setStep(3); // Only show "Awaiting PIN" if the API call succeeded
      } else {
        // Show specific error from Safaricom if possible
        alert("M-Pesa Error: " + (res.data.message || "Prompt failed"));
        setStep(1);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Connection failed. Try again.";
      alert("Error: " + errorMsg);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-gray-100">
        
        {/* STEP 1: CUSTOMER ENTERS THEIR NUMBER */}
        {step === 1 && (
          <form onSubmit={handlePay} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">M-Pesa Checkout</h2>
              <p className="text-gray-500 text-xs mt-1 font-medium">
                {planName} — KES {amount.toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="phone-input" className="text-[10px] font-black text-gray-400 uppercase ml-1">
                Your M-Pesa Number
              </label>
              <input 
                required
                id="phone-input"
                name="phone-input"
                type="tel"
                placeholder="07XXXXXXXX"
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-center text-xl font-black text-gray-900 focus:border-green-500 outline-none transition-all"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all"
            >
              {loading ? "Initializing..." : "Send Payment Prompt"}
            </button>
          </form>
        )}

        {/* STEP 2: LOADING/PROCESSING STATE */}
        {step === 2 && (
          <div className="text-center py-10 flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mb-6"></div>
            <p className="font-black text-gray-900 uppercase tracking-tight">Requesting Prompt...</p>
            <p className="text-gray-500 text-xs mt-2">Connecting to Safaricom Daraja</p>
          </div>
        )}

        {/* STEP 3: AWAITING PIN (AFTER API SUCCESS) */}
        {step === 3 && (
          <div className="text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <div className="h-8 w-8 border-4 border-green-600 border-t-transparent animate-spin rounded-full"></div>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Check Your Phone</h2>
            <p className="text-gray-500 text-sm mt-2 mb-8 font-medium">
              A prompt has been sent to <strong>{phoneNumber}</strong>. Enter your PIN to finish.
            </p>
            
            <div className="w-full bg-gray-50 p-5 rounded-2xl text-left border border-gray-100">
              <p className="font-black text-gray-400 uppercase text-[9px] tracking-widest mb-2">Manual Payment Backup</p>
              <p className="text-xs text-gray-700 font-bold">Paybill: <span className="text-green-600">516600</span></p>
              <p className="text-xs text-gray-700 font-bold">Account: <span className="text-green-600">0675749001</span></p>
            </div>
          </div>
        )}

        <button 
          type="button"
          onClick={onClose} 
          className="w-full mt-8 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
}