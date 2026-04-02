"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  const [step, setStep] = useState(1); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setLoading(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean and Format Number
    let cleanNumber = phoneNumber.replace(/\D/g, ""); // Remove all non-digits
    
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "254" + cleanNumber.slice(1);
    } else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
      cleanNumber = "254" + cleanNumber;
    }

    if (cleanNumber.length !== 12) {
      alert("Invalid number. Please use 07xx... or 01xx... format.");
      return;
    }

    setLoading(true);
    setStep(2); 
    
    try {
      const res = await axios.post("/api/mpesa/stk-push", { 
        amount: Math.round(amount), // Ensure amount is an integer
        phoneNumber: cleanNumber, 
        planName 
      });
      
      if (res.data.success) {
        setStep(3);
      } else {
        alert("API Error: " + (res.data.message || "Prompt failed"));
        setStep(1);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Connection failed";
      alert("Error: " + errorMsg);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4">
      <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
        {step === 1 && (
          <form onSubmit={handlePay} className="flex flex-col gap-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">M-Pesa Checkout</h2>
              <p className="text-gray-500 text-xs mt-1">{planName} - KES {amount}</p>
            </div>
            <input 
              required
              type="tel"
              placeholder="0712345678"
              className="w-full border-2 border-gray-200 p-4 rounded-2xl text-center text-xl font-bold focus:border-green-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest active:scale-95">
              Pay Now
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-bold">Sending Prompt...</p>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-green-600 border-t-transparent animate-spin rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-bold">Check Your Phone</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your M-Pesa PIN to complete the transaction.</p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          Cancel
        </button>
      </div>
    </div>
  );
}