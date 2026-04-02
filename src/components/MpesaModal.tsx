"use client";
import { useState } from "react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
}

export default function MpesaModal({ isOpen, onClose, planName, amount }: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSTKPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid Safaricom phone number first.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber, // This is the value from the input field
          amount: amount,
          planName: planName,
        }),
      });

      if (response.ok) {
        setStatus("success");
        alert("Request sent! Enter your M-Pesa PIN on your phone now.");
        onClose();
      } else {
        setStatus("error");
        const errData = await response.json();
        alert(`Error: ${errData.error || "Payment failed"}`);
      }
    } catch (error) {
      setStatus("error");
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border-4 border-gray-50">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black font-black">
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Confirm Payment</h3>
          <p className="text-gray-500 font-bold mt-2">
            {planName} — <span className="text-green-600">KES {amount.toLocaleString()}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-2">
              Safaricom Number (Required)
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-50/50 outline-none font-black text-xl transition-all placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={handleSTKPush}
            disabled={status === "loading"}
            className="w-full py-6 bg-gray-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-green-600 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-gray-200"
          >
            {status === "loading" ? "Processing..." : "Pay with M-Pesa"}
          </button>
          
          <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            A secure M-Pesa prompt will be sent to this number. <br />
            Enter your PIN to complete the audit.
          </p>
        </div>
      </div>
    </div>
  );
}