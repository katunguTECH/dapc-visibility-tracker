"use client";

import { useState } from "react";
import { useUser, useSignIn, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Pricing from "../components/Pricing";

export default function Home() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  const [business, setBusiness] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAV */}
      <nav className="flex justify-between px-10 py-5 bg-white border-b">
        <img src="/dapc-logo.jpg" className="h-10" />

        <div className="flex gap-4 items-center">
          <SignedOut>
            <button onClick={() => openSignIn?.()} className="font-bold">
              Login
            </button>
            <button
              onClick={() => openSignIn?.()}
              className="bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              Get Started
            </button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-black mb-4">
          Business <span className="text-blue-700">Intelligence</span>
        </h1>

        <input
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          placeholder="Business name"
          className="border px-4 py-2 rounded-lg"
        />
      </div>

      {/* PRICING */}
      <Pricing />
    </div>
  );
}