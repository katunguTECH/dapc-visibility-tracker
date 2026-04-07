"use client";

import { useState } from "react";
import { useUser, SignInButton, SignOutButton, RedirectToSignIn } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      alert("Please sign in to subscribe");
      return;
    }

    if (!phone) {
      alert("Enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await res.json();

      if (data.success) {
        alert("STK Push sent! Check your phone.");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to DAPC</h1>

      {!isSignedIn ? (
        <div>
          <p>Please sign in to subscribe:</p>
          <SignInButton
            mode="modal"
            redirectUrl="/" // ← Redirects back here after sign-in
          >
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-w-sm">
          <p>Hello, {user?.firstName || user?.email}</p>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleSubscribe}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Subscribe"}
          </button>
          <SignOutButton>
            <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </main>
  );
}