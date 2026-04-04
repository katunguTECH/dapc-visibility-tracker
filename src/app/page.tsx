"use client";

import { useState } from "react";

interface MpesaModalProps {
  plan: { name: string; price: number };
  onClose: () => void;
}

export default function MpesaModal({ plan, onClose }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!phoneNumber) return alert("Enter your phone number");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, amount: plan.price, planName: plan.name }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("STK Push sent! Check your phone to complete the payment.");
      } else {
        setMessage("Payment failed. Try again.");
      }
    } catch (err) {
      setMessage("Payment failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Subscribe: {plan?.name}</h2>
        <p className="mb-4">Amount: KES {plan?.price.toLocaleString()}</p>
        <input
          type="tel"
          placeholder="07XXXXXXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4 focus:outline-none"
        />
        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Processing..." : "Pay with M-Pesa"}
        </button>
        {message && <p className="mt-2 text-center">{message}</p>}
        <button onClick={onClose} className="mt-2 w-full py-2 border rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}