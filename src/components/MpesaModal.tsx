"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount, onPaymentSuccess }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | awaiting | success | error

  // Reset modal state when it closes/opens
  useEffect(() => {
    if (!isOpen) {
      setStatus("idle");
      setPhoneNumber("");
      setCheckoutRequestId("");
    }
  }, [isOpen]);

  // POLL THE DATABASE: Check if payment is complete every 3 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "awaiting" && checkoutRequestId) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`/api/mpesa/check-status?checkoutRequestId=${checkoutRequestId}`);
          if (res.data.status === "COMPLETED") {
            setStatus("success");
            clearInterval(interval);
            setTimeout(() => {
              onPaymentSuccess(); 
              onClose();
            }, 2000);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [status, checkoutRequestId, onPaymentSuccess, onClose]);

  const triggerStkPush = async () => {
    if (!phoneNumber) return;
    setStatus("sending");
    try {
      const res = await axios.post("/api/mpesa/stk-push", {
        amount,
        phoneNumber,
        planName
      });
      if (res.data.success) {
        setCheckoutRequestId(res.data.checkoutRequestId);
        setStatus("awaiting");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        
        {/* STEP 1: INPUT PHONE NUMBER */}
        {status === "idle" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Unlock Full Audit</h3>
            <p className="text-gray-500">Enter M-Pesa number for {planName}</p>
            <input
              type="text"
              placeholder="0712345678"
              className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-green-500 outline-none transition-all text-center text-lg"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button 
              onClick={triggerStkPush}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
            >
              Pay KES {amount}
            </button>
          </div>
        )}

        {/* STEP 2: LOADING / AWAITING PIN */}
        {(status === "sending" || status === "awaiting") && (
          <div className="py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
            <p className="font-semibold text-lg">Awaiting M-Pesa PIN...</p>
            <p className="text-sm text-gray-400 mt-2">Check your phone and enter your PIN.</p>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {status === "success" && (
          <div className="py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-green-600 font-bold text-xl">Payment Verified!</p>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 text-red-500">
            <p>Something went wrong. Please try again.</p>
            <button onClick={() => setStatus("idle")} className="mt-2 font-bold underline">Retry</button>
          </div>
        )}

        <button onClick={onClose} className="mt-6 text-gray-400 text-sm hover:text-gray-600">
          Cancel and Return
        </button>
      </div>
    </div>
  );
}