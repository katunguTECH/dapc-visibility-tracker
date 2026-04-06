"use client";
import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

export default function MpesaModal({ amount, planName }: { amount: string, planName: string }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  const handleOpen = () => {
    console.log("Plan selected:", planName, "Signed In:", isSignedIn);
    
    if (!userLoaded || !signInLoaded) return; // Wait for Clerk to load

    if (!isSignedIn) {
      // This forces the Clerk Modal to appear
      window.location.href = "/sign-in"; 
      // Alternative if you have specific paths:
      // return;
    } else {
      setIsOpen(true);
    }
  };

  const processPayment = () => {
    let cleanNumber = phoneNumber.replace(/\D/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "254" + cleanNumber.substring(1);
    } else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
      cleanNumber = "254" + cleanNumber;
    }

    if (cleanNumber.length !== 12) {
      alert("Please enter a valid M-Pesa number (e.g., 0712345678)");
      return;
    }

    alert(`STK Push sent to ${cleanNumber} for KES ${amount}`);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={handleOpen} 
        className="w-full bg-blue-700 text-white py-3 rounded-xl font-black text-xs hover:bg-black transition z-10"
      >
        Select Plan
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-2">M-Pesa Payment</h3>
            <p className="text-slate-500 mb-8">Paying for <span className="text-blue-700 font-bold">{planName}</span></p>
            
            <input 
              type="text" 
              placeholder="07XX XXX XXX" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-lg font-bold outline-none mb-6"
            />

            <div className="flex gap-4">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-4 font-bold text-slate-400">Cancel</button>
              <button onClick={processPayment} className="flex-1 bg-[#24A148] text-white py-4 rounded-xl font-black">Pay KES {amount}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}