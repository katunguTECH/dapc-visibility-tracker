"use client";
import React, { useState, useEffect } from "react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
}

export default function MpesaModal({ isOpen, onClose, planName, amount }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, amount }),
      });

      const result = await response.json();
      if (result.success) {
        alert("STK Push sent! Please check your phone.");
        onClose();
      } else {
        alert("Payment Error: " + (result.message || "Something went wrong"));
      }
    } catch (err) {
      alert("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center">
      {/* Dark Overlay background */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">M-Pesa Pay</h2>
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{planName}</p>
            <p className="text-lg font-black text-blue-900">KES {amount.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="0712345678"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-center text-xl font-bold text-gray-800"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#24b04b] hover:bg-[#1c8c3c] text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? "CHECK YOUR PHONE..." : "SEND STK PUSH"}
          </button>
          
          <p className="text-[10px] text-center text-gray-400 px-4">
            Enter your M-Pesa number above. You will receive a prompt on your phone to enter your PIN.
          </p>
        </form>
      </div>
    </div>
  );
}