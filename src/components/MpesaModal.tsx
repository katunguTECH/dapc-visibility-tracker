"use client";
import { useState } from "react";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSTKPush = async () => {
    // PREVENT API CALL IF BOX IS EMPTY
    if (!phone || phone.length < 10) {
      alert("Please enter a valid Safaricom number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, amount, planName }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Prompt sent! Check your phone.");
        onClose();
      } else {
        alert("Error: " + (data.message || "Invalid Number"));
      }
    } catch (err) {
      alert("API Error. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-10 shadow-2xl relative border-2 border-gray-100">
        <h2 className="text-xl font-black uppercase italic mb-2 text-black">M-Pesa Number</h2>
        <p className="text-gray-400 font-bold text-[10px] uppercase mb-8">{planName} — KES {amount}</p>
        
        <div className="mb-8">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-1">Safaricom Number</label>
          <input
            type="tel"
            autoFocus
            required
            className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-xl outline-none focus:border-green-500 text-black placeholder:text-gray-300"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSTKPush}
          disabled={loading}
          className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all disabled:opacity-50 shadow-lg"
        >
          {loading ? "Requesting..." : "Send Payment Prompt"}
        </button>
        
        <button onClick={onClose} className="w-full mt-4 text-gray-400 font-bold text-[10px] uppercase hover:text-red-500">
          Cancel Transaction
        </button>
      </div>
    </div>
  );
}