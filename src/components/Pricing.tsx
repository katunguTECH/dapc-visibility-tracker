"use client";

import { useState } from "react";

const plans = [
  { name: "Starter", price: 1999, icon: "/icons/starter-cheetah.jpg" },
  { name: "Boost", price: 3999, icon: "/icons/boost-buffalo.jpg" },
  { name: "Growth", price: 5999, icon: "/icons/growthengine-rhino.jpg" },
  { name: "Leader", price: 7999, icon: "/icons/marketleader-elephant.jpg" },
  { name: "Super", price: 10000, icon: "/icons/superactivevisibility-lion.jpg" },
];

export default function Pricing() {
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<any>(null);

  const sendSTK = async () => {
    if (!phone || !plan) return alert("Enter phone");

    const formatted =
      phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    const res = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: formatted,
        amount: plan.price,
      }),
    });

    const data = await res.json();

    alert(data.success ? "STK sent!" : "Failed");
    setPlan(null);
    setPhone("");
  };

  return (
    <div className="grid md:grid-cols-5 gap-4 px-4 mt-10">

      {plans.map((p) => (
        <div key={p.name} className="border p-4 rounded-xl text-center">

          <img src={p.icon} className="w-14 h-14 mx-auto mb-2 rounded-full" />

          <h3 className="font-bold">{p.name}</h3>
          <p className="text-blue-600">KES {p.price}</p>

          <button
            onClick={() => setPlan(p)}
            className="bg-blue-600 text-white px-3 py-2 rounded mt-3 w-full"
          >
            Subscribe
          </button>

        </div>
      ))}

      {plan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">

            <h3 className="font-bold mb-2">
              Pay KES {plan.price}
            </h3>

            <input
              className="border w-full p-2 mb-3"
              placeholder="0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendSTK}
              className="bg-green-600 text-white w-full py-2 rounded"
            >
              Pay Now
            </button>

          </div>
        </div>
      )}
    </div>
  );
}