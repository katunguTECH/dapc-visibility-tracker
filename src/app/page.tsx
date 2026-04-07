// src/app/page.tsx
"use client";

import Image from "next/image";
import Pricing from "../components/Pricing";
import { useUser, useSignIn } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center bg-blue-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to DAPC Visibility Tracker
        </h1>
        <p className="text-lg md:text-2xl mb-6">
          Monitor your brand, analyze competitors, and boost your visibility.
        </p>

        {!isSignedIn && (
          <button
            onClick={() => openSignIn?.()}
            className="bg-white text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition"
          >
            Sign in to get started
          </button>
        )}
      </section>

      {/* PRICING SECTION */}
      <Pricing />

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow p-6 text-center">
            <Image
              src="/icons/analyze.png"
              alt="Analyze"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="font-bold mb-2">Analyze Competitors</h3>
            <p>Track competitor activity to stay ahead in your market.</p>
          </div>
          <div className="bg-white rounded-3xl shadow p-6 text-center">
            <Image
              src="/icons/monitor.png"
              alt="Monitor"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="font-bold mb-2">Monitor Visibility</h3>
            <p>Get real-time insights into your brand’s online performance.</p>
          </div>
          <div className="bg-white rounded-3xl shadow p-6 text-center">
            <Image
              src="/icons/boost.png"
              alt="Boost"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="font-bold mb-2">Boost Performance</h3>
            <p>Implement strategies that drive real growth and engagement.</p>
          </div>
        </div>
      </section>
    </main>
  );
}