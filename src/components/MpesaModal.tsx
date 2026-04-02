"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount, onPaymentSuccess }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [loading, setLoading] = useState(false);

  // Reset state whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setPhoneNumber("");
      setLoading(false);
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    if (phoneNumber.length < 10) return alert("Enter a valid phone number");
    
    setLoading(true);
    try {
      const res = await axios.post("/api/mpesa/stk-push", { amount, phoneNumber, planName });
      if (res.data.success) {
        setStatus("awaiting");
      } else {
        alert("Error: " + res.data.message);
        setStatus("idle");
      }
    } catch (e) {
      setStatus("idle");
      alert("Failed to send push.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[99999] p-4">
      <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative">
        
        {/* SECTION 1: THE INPUT FORM */}
        {status === "idle" && (
          <form onSubmit={handlePay} className="flex flex-col gap-4 text-center">
            <h2 className="text-2xl font-black text-gray-900">M-Pesa Payment</h2>
            <p className="text-gray-500 text-sm">Enter number for {planName}</p>
            
            <div className="text-left">
              <label htmlFor="phone" className="block text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1">
                Phone Number
              </label>
              <input 
                id="phone"
                name="phone"
                type="tel" 
                autoComplete="tel"
                required
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-lg font-bold outline-none focus:border-green-500 transition-all" 
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 uppercase text-xs tracking-widest"
            >
              {loading ? "Processing..." : "Send M-Pesa Prompt"}
            </button>
          </form>
        )}

        {/* SECTION 2: THE AWAITING SCREEN */}
        {status === "awaiting" && (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mb-6"></div>
            <h2 className="text-xl font-black text-gray-900">Awaiting M-Pesa PIN</h2>
            <p className="text-gray-500 text-sm px-4">Check your phone and enter your PIN to complete the <strong>{planName}</strong> subscription.</p>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl w-full text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Manual Payment Backup</p>
              <p className="text-sm text-gray-700">Paybill: <strong>516600</strong></p>
              <p className="text-sm text-gray-700">Account: <strong>0675749001</strong></p>
            </div>
          </div>
        )}

        <button 
          type="button"
          onClick={onClose} 
          className="mt-6 text-gray-400 w-full text-[10px] font-bold uppercase tracking-widest hover:text-gray-600"
        >
          Close and Return
        </button>
      </div>
    </div>
  );
}