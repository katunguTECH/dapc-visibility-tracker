"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      alert("Please sign in to subscribe");
      return;
    }

    const phone = prompt("Enter your phone number (e.g., 0712345678)");
    if (!phone) return;

    const amount = 100; // Example amount

    setLoading(true);
    const res = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      body: JSON.stringify({ phone, amount }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("STK Push response:", data);
    setLoading(false);
    alert(data.success ? "STK sent! Check your phone." : data.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to DAPC</h1>
      <p className="mb-6">Sign in to subscribe and get growth insights</p>

      {!isSignedIn ? (
        <SignInButton>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Sign In
          </button>
        </SignInButton>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          {loading ? "Processing..." : "Subscribe"}
        </button>
      )}
    </div>
  );
}