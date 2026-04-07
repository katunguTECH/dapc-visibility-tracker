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
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, amount }),
      });

      const data = await res.json();
      console.log("STK Response:", data);

      if (data.success) {
        alert("STK Push sent! Check your phone for the M-Pesa PIN prompt.");
        onClose();
      } else {
        alert("Payment Error: " + (data.message || "Something went wrong"));
      }
    } catch (err) {
      alert("Network error. Check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black">M-Pesa Pay</h2>
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-bold text-blue-700 uppercase">{planName}</p>
            <p className="text-lg font-black text-blue-900">KES {amount.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <input
            type="tel"
            placeholder="0712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full p-4 text-center border rounded-xl focus:ring-2 focus:ring-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:bg-gray-300"
          >
            {loading ? "CHECK YOUR PHONE..." : "SEND STK PUSH"}
          </button>
        </form>
      </div>
    </div>
  );
}