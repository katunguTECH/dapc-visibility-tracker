"use client";
import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

export default function MpesaModal({ amount, planName }: { amount: string, planName: string }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const handleOpen = () => {
    if (!isSignedIn) {
      alert("Please sign in to subscribe to a plan.");
      openSignIn?.({});
      return;
    }
    setIsOpen(true);
  };

  const processPayment = () => {
    let cleanNumber = phoneNumber.replace(/\D/g, ""); // Remove non-digits
    
    // Formatting Logic
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "254" + cleanNumber.substring(1);
    } else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
      cleanNumber = "254" + cleanNumber;
    }

    if (cleanNumber.length !== 12) {
      alert("Please enter a valid M-Pesa number (e.g., 0712345678)");
      return;
    }

    alert(`Initiating STK Push for ${planName} to ${cleanNumber}...`);
    // Here you would call your backend API with cleanNumber and amount
  };

  return (
    <>
      <button onClick={handleOpen} className="w-full bg-blue-700 text-white py-3 rounded-xl font-black text-xs hover:bg-black transition">
        Select Plan
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-2">M-Pesa Payment</h3>
            <p className="text-slate-500 font-medium mb-8">Confirming payment for <span className="text-blue-700 font-bold">{planName}</span></p>
            
            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</label>
              <input 
                type="text" 
                placeholder="07XX XXX XXX" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-lg font-bold outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
              <button onClick={processPayment} className="flex-1 bg-[#24A148] text-white py-4 rounded-xl font-black shadow-lg">Pay KES {amount}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}