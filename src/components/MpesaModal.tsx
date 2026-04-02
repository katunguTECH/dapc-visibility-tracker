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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSTKPush = async () => {
    // Basic formatting to ensure it starts with 254
    let formattedNumber = phoneNumber.replace(/\D/g, "");
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "254" + formattedNumber.slice(1);
    } else if (formattedNumber.startsWith("7") || formattedNumber.startsWith("1")) {
      formattedNumber = "254" + formattedNumber;
    }

    if (formattedNumber.length !== 12) {
      alert("Please enter a valid Safaricom number (e.g. 0712345678)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedNumber,
          amount: amount,
          planName: planName,
        }),
      });

      if (response.ok) {
        alert("Request sent! Please check your phone for the M-Pesa PIN prompt.");
        onClose();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-900 uppercase italic">M-Pesa Checkout</h3>
          <p className="text-gray-500 font-bold mt-2">Paying KES {amount.toLocaleString()} for {planName}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">
              Safaricom Phone Number
            </label>
            <input
              type="text"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none font-bold text-lg transition-all"
            />
          </div>

          <button
            onClick={handleSTKPush}
            disabled={loading}
            className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Initializing..." : "Send Payment Request"}
          </button>
        </div>
      </div>
    </div>
  );
}