"use client";
import React, { useState } from "react";

export default function MpesaModal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: amount,
        }),
      });

      // Crucial: check if response is JSON to avoid the "Unexpected token A" error
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (result.success) {
          alert("STK Push sent successfully! Check your phone.");
        } else {
          alert("Payment Failed: " + (result.message || "Unknown error"));
        }
      } else {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        alert("Server Error: Check Vercel logs.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Pay with M-Pesa</h2>
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            placeholder="0712345678"
            className="w-full p-2 border rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount (KES)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Requesting..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}