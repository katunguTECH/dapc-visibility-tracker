"use client";
import { useState } from "react";

interface MpesaModalProps {
  isOpen: boolean;        // Add this
  onClose: () => void;
  planName: string;       // Changed from plan object
  amount: number;         // Changed from plan object
  onPaymentSuccess?: () => void; // Add this to match your page
}

export default function MpesaModal({ isOpen, onClose, planName, amount, onPaymentSuccess }: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

  const handlePay = async () => {
    if (!phone) return alert("Enter phone number");
    setStatus("Sending STK Push...");

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use planName and amount directly
        body: JSON.stringify({ phoneNumber: phone, amount: amount, planName: planName }),
      });
      const data = await res.json();

      if (data.ResponseCode === "0") {
        setStatus("STK Push sent! Check your phone.");
        if (onPaymentSuccess) onPaymentSuccess(); // Trigger the success logic
      } else {
        setStatus("Payment failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Payment failed. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Subscribe: {planName}</h2>
        <p className="text-gray-600">Amount: KES {amount.toLocaleString()}</p>
        
        <input
          type="tel"
          placeholder="2547XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-4 p-3 border rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
        />
        
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handlePay}
            className="bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Pay with M-Pesa
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 px-4 py-2 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
        {status && <p className="mt-4 text-sm text-center text-blue-600 font-medium">{status}</p>}
      </div>
    </div>
  );
}