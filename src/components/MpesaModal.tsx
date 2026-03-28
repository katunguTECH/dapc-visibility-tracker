"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount, onPaymentSuccess }: any) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | awaiting | success | error

  // Poll the database for payment confirmation
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
              onPaymentSuccess(); // This triggers the parent to unlock the audit
              onClose();
            }, 2000);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000); // Check every 3 seconds
    }
    return () => clearInterval(interval);
  }, [status, checkoutRequestId]);

  const triggerStkPush = async () => {
    setStatus("sending");
    try {
      const res = await axios.post("/api/mpesa/stk-push", {
        amount,
        phoneNumber,
        planName
      });
      if (res.data.success) {
        setCheckoutRequestId(res.data.checkoutRequestId); // You'll need to return this from your API
        setStatus("awaiting");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        {status === "success" ? (
          <div className="animate-bounce text-6xl mb-4">✅</div>
        ) : (
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Unlock Full Audit</h3>
            <p className="text-gray-500 mt-2">Subscribe to {planName} for KES {amount}</p>
          </div>
        )}

        {status === "idle" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="M-Pesa Number (07...)"
              className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-green-500 outline-none transition-all"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button 
              onClick={triggerStkPush}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-200"
            >
              Pay via M-Pesa
            </button>
          </div>
        )}

        {(status === "sending" || status === "awaiting") && (
          <div className="py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
            <p className="font-semibold text-lg">Awaiting M-Pesa PIN...</p>
            <p className="text-sm text-gray-400 mt-2">Check your phone and enter your PIN to continue.</p>
          </div>
        )}

        {status === "success" && (
          <p className="text-green-600 font-bold text-xl">Payment Verified! Unlocking...</p>
        )}

        <button onClick={onClose} className="mt-6 text-gray-400 text-sm hover:text-gray-600">
          Cancel and Return
        </button>
      </div>
    </div>
  );
}