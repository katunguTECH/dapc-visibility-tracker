// src/components/MpesaModal.tsx
"use client";

import { useState } from "react";

interface MpesaModalProps {
  plan: { name: string; price: number };
  onClose: () => void;
}

export default function MpesaModal({ plan, onClose }: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  const handlePay = async () => {
    if (!phone) return alert("Enter phone number");
    setStatus("Sending STK Push...");

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, amount: plan.price, planName: plan.name }),
      });
      const data = await res.json();

      if (data.ResponseCode === "0") {
        setStatus("STK Push sent! Check your phone to complete the payment.");
      } else {
        setStatus("Payment failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Payment failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Subscribe: {plan.name}</h2>
        <p>Amount: KES {plan.price.toLocaleString()}</p>
        <input
          type="tel"
          placeholder="2547XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={handlePay}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Pay with M-Pesa
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </div>
  );
}