"use client";

import { useState } from "react";

export default function MpesaModal({
  amount,
  planName,
}: {
  amount: string;
  planName: string;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!phone) {
      alert("Enter phone number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        body: JSON.stringify({
          phone,
          amount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("📲 STK Push sent! Check your phone.");
        setOpen(false);
      } else {
        alert("Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-700"
      >
        Pay via M-Pesa
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md">
            <h2 className="text-xl font-black mb-4">
              Pay for {planName}
            </h2>

            <input
              type="text"
              placeholder="2547XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            />

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold"
            >
              {loading ? "Processing..." : `Pay KES ${amount}`}
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}