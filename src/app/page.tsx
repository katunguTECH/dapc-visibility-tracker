"use client";

import { useSignIn, useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Pricing from "../components/Pricing";

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useSignIn();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white border-b">
        <img src="/dapc-logo.jpg" className="h-10" />

        <div className="flex gap-4 items-center">
          <SignedOut>
            <button onClick={() => openSignIn?.()}>
              Login
            </button>
            <button
              onClick={() => openSignIn?.()}
              className="bg-blue-700 text-white px-5 py-2 rounded-xl"
            >
              Get Started
            </button>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <h1 className="text-5xl font-black mb-4">
          Business Intelligence for Nairobi
        </h1>
        <p className="text-lg mb-6">
          Scan your Google Maps, Social Media, and SEO footprint in real-time.
        </p>

        {!isSignedIn && (
          <button
            onClick={() => openSignIn?.()}
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold"
          >
            Sign in to get started
          </button>
        )}
      </section>

      {/* FEATURES (YOUR ICONS RESTORED) */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/starter-cheetah.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Fast Visibility</h3>
          <p>Get discovered quickly in local search.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/boost-buffalo.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Stronger Presence</h3>
          <p>Dominate Google Maps & search rankings.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow text-center">
          <img src="/icons/growthengine-rhino.jpg" className="w-16 mx-auto mb-4 rounded-full"/>
          <h3 className="font-bold">Predictable Growth</h3>
          <p>Turn visibility into real customers.</p>
        </div>
      </section>

      {/* PRICING */}
      <Pricing isSignedIn={isSignedIn} />
    </main>
  );
}