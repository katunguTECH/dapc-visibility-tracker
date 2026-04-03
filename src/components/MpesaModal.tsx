"use client";
import { useState } from "react";

export default function MpesaModal({ isOpen, onClose, planName, amount }: any) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSTKPush = async () => {
    // Validate local format first (07XXXXXXXX)
    if (!/^0\d{9}$/.test(phone)) {
      alert("Enter a valid Safaricom number (0712345678)");
      return;
    }

    setLoading(true);

    try {
      // Convert to 2547XXXXXXXX
      let formattedPhone = phone;

      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.slice(1);
      }

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount,
          planName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("📲 Payment prompt sent! Check your phone.");
        onClose();
      } else {
        alert("❌ Error: " + (data.message || "Failed to send prompt"));
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ API Error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-10 shadow-2xl border-2 border-gray-100">
        <h2 className="text-xl font-black uppercase italic mb-2 text-black">
          M-Pesa Payment
        </h2>

        <p className="text-gray-400 font-bold text-[10px] uppercase mb-8">
          {planName} — KES {amount}
        </p>

        <input
          type="tel"
          placeholder="0712345678"
          value={phone}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            setPhone(value.slice(0, 10));
          }}
          className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-xl outline-none focus:border-green-500 text-black mb-6"
        />

        <button
          onClick={handleSTKPush}
          disabled={loading}
          className="w-full py-5 bg-green-600 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-black disabled:opacity-50"
        >
          {loading ? "Requesting..." : "Pay Now"}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-400 font-bold text-[10px] uppercase hover:text-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}