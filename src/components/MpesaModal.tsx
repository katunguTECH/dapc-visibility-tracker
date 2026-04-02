"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  // Explicitly start at 'INPUT' every time the component loads
  const [status, setStatus] = useState<'INPUT' | 'SENDING' | 'AWAITING_PIN'>('INPUT');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // FORCE RESET: This ensures that if a user closes and re-opens, they start at Step 1
  useEffect(() => {
    if (isOpen) {
      setStatus('INPUT');
      setPhoneNumber("");
      setLoading(false);
    }
  }, [isOpen]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the number to 254... format for Safaricom
    let clean = phoneNumber.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = "254" + clean.slice(1);
    else if (clean.startsWith("7") || clean.startsWith("1")) clean = "254" + clean;

    if (clean.length !== 12) {
      alert("Please enter a valid Safaricom number (e.g. 0712345678)");
      return;
    }

    setLoading(true);
    setStatus('SENDING'); 

    try {
      // We pass the 'clean' phoneNumber typed by the user to the API
      const res = await axios.post("/api/mpesa/stk-push", { 
        amount: Math.round(amount), 
        phoneNumber: clean, 
        planName 
      });
      
      if (res.data.success) {
        setStatus('AWAITING_PIN');
      } else {
        alert("M-Pesa Error: " + (res.data.message || "Request failed"));
        setStatus('INPUT');
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Connection Error. Please check your internet and try again.");
      setStatus('INPUT');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] p-4 backdrop-blur-md">
      <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl border border-gray-100">
        
        {/* STEP 1: THE PHONE INPUT */}
        {status === 'INPUT' && (
          <form onSubmit={handlePay} className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">M-Pesa Checkout</h2>
              <p className="text-gray-500 text-xs mt-1 font-bold">{planName} — KES {amount.toLocaleString()}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Enter M-Pesa Number</label>
              <input 
                required
                autoFocus
                type="tel"
                placeholder="0712345678"
                className="w-full border-2 border-gray-100 p-4 rounded-2xl text-center text-xl font-black text-gray-900 focus:border-green-500 outline-none transition-all shadow-inner bg-gray-50"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-green-100 active:scale-95 transition-all"
            >
              {loading ? "Processing..." : "Send Prompt to My Phone"}
            </button>
          </form>
        )}

        {/* STEP 2: SENDING TO SAFARICOM */}
        {status === 'SENDING' && (
          <div className="text-center py-10 flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mb-6"></div>
            <p className="font-black text-gray-900 uppercase text-xs tracking-widest italic">Requesting STK Push...</p>
          </div>
        )}

        {/* STEP 3: AWAITING PIN ON CUSTOMER PHONE */}
        {status === 'AWAITING_PIN' && (
          <div className="text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <div className="h-8 w-8 border-4 border-green-600 border-t-transparent animate-spin rounded-full"></div>
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight italic">CHECK YOUR PHONE</h2>
            <p className="text-gray-500 text-sm mt-2 mb-8 font-medium">
              A prompt has been sent to <strong>{phoneNumber}</strong>. Please enter your M-Pesa PIN.
            </p>
            
            <div className="w-full bg-gray-50 p-5 rounded-2xl text-left border border-gray-100">
              <p className="font-black text-gray-400 uppercase text-[9px] tracking-widest mb-2 italic">Manual Backup</p>
              <p className="text-xs text-gray-700 font-bold">Paybill: <span className="text-green-600">516600</span></p>
              <p className="text-xs text-gray-700 font-bold">Account: <span className="text-green-600">0675749001</span></p>
            </div>
          </div>
        )}

        <button 
          onClick={onClose} 
          className="w-full mt-8 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:text-gray-600 transition-colors"
        >
          Cancel & Return
        </button>
      </div>
    </div>
  );
}