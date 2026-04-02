"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  onPaymentSuccess: () => void;
}

export default function MpesaModal({ 
  isOpen, 
  onClose, 
  planName, 
  amount, 
  onPaymentSuccess 
}: MpesaModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutRequestId, setCheckoutRequestId] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "awaiting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // 1. RESET MODAL ON OPEN/CLOSE
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setPhoneNumber("");
      setCheckoutRequestId("");
      setErrorMessage("");
    }
  }, [isOpen]);

  // 2. STATUS POLLING: Check the database for "COMPLETED" every 3 seconds
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
              onPaymentSuccess(); // Triggers the 'Unlock' or 'Dashboard' redirect
              onClose();
            }, 2000);
          }
        } catch (err) {
          console.error("Status check failed", err);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [status, checkoutRequestId, onPaymentSuccess, onClose]);

  // 3. TRIGGER THE STK PUSH
  const triggerStkPush = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }

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
        setErrorMessage(res.data.message || "Request failed");
        setStatus("error");
      }
    } catch (error: any) {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden">
        
        {/* --- STEP 1: IDLE / INPUT --- */}
        {status === "idle" && (
          <div className="animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Complete Payment</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Subscribe to <strong>{planName}</strong> for KES {amount.toLocaleString()}
            </p>
            
            <div className="space-y-4">
              <div className="text-left">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">M-Pesa Number</label>
                <input
                  type="text"
                  placeholder="0712345678"
                  className="w-full border-2 border-gray-100 rounded-2xl p-4 focus:border-green-500 outline-none transition-all text-lg font-bold"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <button 
                onClick={triggerStkPush}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-100 uppercase text-xs tracking-widest"
              >
                Send M-Pesa Prompt
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: LOADING / AWAITING --- */}
        {(status === "sending" || status === "awaiting") && (
          <div className="py-8 animate-in fade-in scale-95 duration-300">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Check Your Phone</h3>
            <p className="text-gray-500 text-sm mb-6">Enter your M-Pesa PIN to authorize payment.</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl text-left text-[11px] space-y-1">
              <p className="font-bold text-gray-400 uppercase tracking-tighter">Manual Payment Backup</p>
              <p className="text-gray-700">Paybill: <span className="font-bold">516600</span></p>
              <p className="text-gray-700">Account: <span className="font-bold text-green-600">0675749001</span></p>
            </div>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {status === "success" && (
          <div className="py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              ✓
            </div>
            <h3 className="text-2xl font-black text-gray-900">Paid!</h3>
            <p className="text-gray-500 mt-2">Unlocking your audit now...</p>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {status === "error" && (
          <div className="py-4">
            <div className="text-red-500 text-4xl mb-2">!</div>
            <p className="text-gray-800 font-bold">{errorMessage}</p>
            <button 
              onClick={() => setStatus("idle")} 
              className="mt-4 text-green-600 font-bold underline text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* --- CLOSE BUTTON --- */}
        {status !== "success" && (
          <button 
            onClick={onClose} 
            className="mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Close & Return
          </button>
        )}
      </div>
    </div>
  );
}