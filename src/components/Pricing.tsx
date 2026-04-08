"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function Pricing({ isSignedIn }: { isSignedIn: boolean }) {
  const { openSignIn } = useSignIn();

  const plans = [
    { name: "Starter Listing", price: 1999, icon: "/icons/starter-cheetah.jpg" },
    { name: "Local Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
    { name: "Growth Engine", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
    { name: "Market Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
    { name: "Super Active", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
  ];

  const [selected, setSelected] = useState<any>(null);
  const [phone, setPhone] = useState("");

  const handleClick = (plan: any) => {
    console.log("CLICKED:", plan.name);

    if (!isSignedIn) {
      openSignIn?.();
      return;
    }

    setSelected(plan);
  };

  const sendSTK = async () => {
    const res = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      body: JSON.stringify({
        phone,
        amount: selected.price,
      }),
    });

    alert("STK sent!");
    setSelected(null);
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-black text-center mb-10">
        Choose Your Growth Tier
      </h2>

      <div className="grid md:grid-cols-5 gap-4">
        {plans.map((p, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow text-center">
            <img src={p.icon} className="w-16 h-16 mx-auto mb-4 rounded-full" />
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-xl font-bold mb-4">KES {p.price}</p>

            <button
              onClick={() => handleClick(p)}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl w-full"
            >
              {isSignedIn ? "Subscribe" : "Sign In to Subscribe"}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="font-bold mb-4">Enter Phone Number</h3>

            <input
              className="border p-2 w-full mb-4"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendSTK}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Pay KES {selected.price}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}