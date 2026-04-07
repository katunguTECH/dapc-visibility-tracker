// src/components/Pricing.tsx
"use client";

import { useState } from "react";
import { useUser, useSignIn } from "@clerk/nextjs";

interface PricingProps {
  isSignedIn: boolean;
}

const plans = [
  {
    name: "Starter",
    price: 500,
    features: ["Track 5 competitors", "Daily updates", "Basic analytics"],
  },
  {
    name: "Pro",
    price: 1500,
    features: ["Track 20 competitors", "Real-time updates", "Advanced analytics"],
  },
  {
    name: "Enterprise",
    price: 5000,
    features: ["Unlimited competitors", "Custom reports", "Priority support"],
  },
];

export default function Pricing({ isSignedIn }: PricingProps) {
  const { openSignIn } = useSignIn();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planPrice: number) => {
    if (!isSignedIn) {
      openSignIn?.();
      return;
   