"use client";
import { useState } from "react";
import axios from "axios";

export default function AuditPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // 'idle' | 'pending' | 'success'

  const handlePayment = async () => {
    setLoading(true);
    setStatus("pending");
    try {
      const response = await axios.post("/api/mpesa/stk-push", {
        amount: 1, // Change to your plan price
        phoneNumber: phoneNumber,
        planName: "Starter Listing",
      });

      if (response.data.success) {
        alert("Check your phone for the M-Pesa prompt!");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to send prompt. Check your credentials.");
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* 1. The Trigger Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
      >
        Unlock Full Pro Audit
      </button>

      {/* 2. The M-Pesa Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Complete Subscription</h2>
            
            {status === "pending" ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="font-medium">Awaiting M-Pesa Prompt...</p>
                <p className="text-sm text-gray-500 mt-2">Check your phone and enter your PIN.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your M-Pesa number to subscribe to the <strong>Starter Listing</strong>.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!phoneNumber || loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Pay Now"}
                </button>
              </>
            )}

            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-4 text-gray-500 text-sm hover:underline"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}