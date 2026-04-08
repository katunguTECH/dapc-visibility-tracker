"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

interface PricingProps {
  isSignedIn: boolean;
}

const plans = [
  { name: "Starter Listing", price: 1999 },
  { name: "Local Boost", price: 3999 },
  { name: "Growth Engine", price: 5999 },
  { name: "Market Leader", price: 7999 },
  { name: "Super Active", price: 10000 },
];

export default function Pricing({ isSignedIn }: PricingProps) {
  const { openSignIn } = useSignIn();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: any) => {
    console.log("CLICKED:", plan.name);

    // 🚫 Not signed in → force login
    if (!isSignedIn) {
      console.log("Opening sign-in...");
      openSignIn?.();
      return;
    }

    // ✅ Ask for phone number
    const phone = prompt("Enter your M-Pesa phone number (e.g. 07XXXXXXXX)");

    if (!phone) {
      alert("Phone number is required");
      return;
    }

    console.log("User signed in → sending STK");

    try {
      setLoading(true);

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          amount: plan.price,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON:",