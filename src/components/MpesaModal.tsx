"use client";
import { useState } from "react";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid Safaricom number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount, planName }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Prompt sent to your phone!");
        onClose();
      } else {
        alert("Error: " + (data.message || "Failed"));
      }
    } catch (err) {
      alert("Server Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
        <h2 className="text-xl font-black uppercase italic mb-2">M-Pesa Checkout</h2>
        <p className="text-gray-500 font-bold text-xs mb-6 uppercase">{planName} - KES {amount}</p>
        
        <div className="mb-6">
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="0712345678"
            className="w-full p-4 bg-gray-50 border-2 rounded-2xl font-black text-lg focus:border-green-500 outline-none"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoFocus
          />
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        
        <button onClick={onClose} className="w-full mt-4 text-gray-400 font-bold text-[10px] uppercase">Cancel</button>
      </div>
    </div>
  );
}