"use client";
import React, { useState } from "react";

export default function MpesaModal() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            phone: "0712345678", // Replace with state from input
            amount: 1 
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("STK Push sent! Check your phone.");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h3>Pay via M-Pesa</h3>
      <button 
        onClick={handlePayment} 
        disabled={loading}
        className="bg-green-500 text-white p-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}