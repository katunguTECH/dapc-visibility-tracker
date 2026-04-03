"use client";
import { useState, useEffect } from "react";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
}

export default function MpesaModal({ isOpen, onClose, planName, amount }: MpesaModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Stop background scrolling when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid Safaricom number first!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          amount: amount,
          planName: planName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Payment Prompt sent! Please check your phone for the M-Pesa PIN screen.");
        onClose();
      } else {
        alert(`Error: ${data.message || "Failed to trigger STK Push"}`);
      }
    } catch (error) {
      console.error(error);
      alert("System connection error. Check your internet or API logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative border-4 border-gray-50">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-black font-black text-xl"
        >
          ✕
        </button>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-gray-900 uppercase italic">M-Pesa Checkout</h3>
          <p className="text-gray-500 font-bold mt-2 text-xs">
            {planName} — <span className="text-green-600 font-black">KES {amount.toLocaleString()}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-2">
              Safaricom Phone Number (Required)
            </label>
            <input
              type="tel"
              required
              autoFocus
              placeholder="e.g., 0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-green-500 outline-none font-black text-xl text-black transition-all"
            />
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-6 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black disabled:opacity-50 transition-all shadow-xl shadow-green-100"
          >
            {loading ? "Initializing STK Push..." : "Send Payment Prompt"}
          </button>
          
          <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            Ensure your phone is unlocked. You will receive <br /> a pop-up to enter your M-Pesa PIN.
          </p>
        </div>
      </div>
    </div>
  );
}