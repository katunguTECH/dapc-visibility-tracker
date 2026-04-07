"use client";
import React, { useState } from "react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
}

export default function MpesaModal({ isOpen, onClose, planName, amount }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: amount,
          planName: planName
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          alert(`STK Push sent for ${planName}! Check your phone.`);
          onClose();
        } else {
          alert("Payment Failed: " + (result.message || "Unknown error"));
        }
      } else {
        alert("Server Error: Check Vercel logs.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">&times;</button>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          You are subscribing to <strong>{planName}</strong> for <strong>KES {amount.toLocaleString()}</strong>
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">M-Pesa Phone Number</label>
            <input
              type="text"
              placeholder="0712345678"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Confirm & Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}