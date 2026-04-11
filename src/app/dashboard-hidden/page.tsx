"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dapc_subscription");
    if (stored) {
      setSubscription(JSON.parse(stored));
    }
  }, []);

  // 🔥 PLAN LEVEL LOGIC
  const getPlanLevel = () => {
    if (!subscription) return "No Plan";

    switch (subscription.plan) {
      case "Starter Listing":
        return "Basic Access";
      case "Local Boost":
        return "Growth Access";
      case "Growth Engine":
        return "Pro Access";
      case "Market Leader":
        return "Elite Access";
      case "Super Active":
        return "Ultimate Access";
      default:
        return "Custom Plan";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      
      {/* HEADER */}
      <h1 className="text-3xl font-black mb-6">
        Welcome, {user?.firstName || "User"} 👋
      </h1>

      {/* SUBSCRIPTION CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg">

        <h2 className="text-xl font-bold mb-6">
          Your Subscription
        </h2>

        {subscription ? (
          <div className="space-y-3 text-gray-700">

            <p>
              <strong>Plan:</strong> {subscription.plan}
            </p>

            <p>
              <strong>Access Level:</strong>{" "}
              <span className="text-green-600 font-bold">
                {getPlanLevel()}
              </span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-bold">
                {subscription.status}
              </span>
            </p>

            <p>
              <strong>Amount Paid:</strong> KES {subscription.amount}
            </p>

            <p>
              <strong>Started:</strong>{" "}
              {new Date(subscription.date).toLocaleDateString()}
            </p>

            {/* OPTIONAL EXPIRY LOGIC */}
            <p>
              <strong>Expires:</strong>{" "}
              {new Date(
                new Date(subscription.date).getTime() + 30 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>

          </div>
        ) : (
          <div className="text-gray-500">
            <p className="mb-4">
              You do not have an active subscription yet.
            </p>

            <a
              href="/#pricing"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition"
            >
              View Plans
            </a>
          </div>
        )}
      </div>
    </div>
  );
}