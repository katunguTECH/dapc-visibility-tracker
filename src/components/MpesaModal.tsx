"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount, onPaymentSuccess }: any) {
  // These are the only 3 states we need
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("idle"); // MUST BE "idle"
  const [loading, setLoading] = useState(false);

  // Force reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setLoading(false);
      setPhoneNumber("");
    }
  }, [isOpen]);

  const handleStkPush = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/mpesa/stk-push", {
        amount,
        phoneNumber,
        planName,
      });
      if (res.data.success) {
        setStatus("awaiting"); // ONLY move to awaiting after SUCCESS
      } else {
        alert("Safaricom Error: " + res.data.message);
        setStatus("idle");
      }
    } catch (error) {
      alert("Connection failed. Try again.");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative">
        
        {/* SECTION 1: THE INPUT (Only visible if status is idle) */}
        {status === "idle" && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-2">M-Pesa Payment</h2>
            <p className="text-gray-500 text-sm mb-6">Confirm {planName} for KES {amount}</p>
            
            <input
              type="text"
              placeholder="07XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl p-4 mb-4 text-center text-xl font-bold focus:border-green-500 outline-none"
            />
            
            <button
              onClick={handleStkPush}
              disabled={loading || phoneNumber.length < 10}
              className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-700 disabled:bg-gray-200 transition-all"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}

        {/* SECTION 2: THE WAITING SCREEN (Only visible if status is awaiting) */}
        {status === "awaiting" && (
          <div className="flex flex-col items-center text-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-6"></div>
            <h2 className="text-xl font-black text-gray-900">Check Your Phone</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your M-Pesa PIN to complete subscription.</p>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl w-full text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Manual Backup</p>
              <p className="text-sm text-gray-700">Paybill: 516600</p>
              <p className="text-sm text-gray-700">Account: 0675749001</p>
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="w-full mt-6 text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}