"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/dapc-logo.jpg"
          alt="DAPC watermark"
          className="w-[700px] opacity-5 select-none"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          DAPC Visibility Tracker
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Monitor your business exposure, track leads, and optimize your online presence with AI-powered insights.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl w-full">

          <Link
            href="/sign-up"
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Sign Up
          </Link>

          <Link
            href="/sign-in"
            className="bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Sign In
          </Link>

          <Link
            href="/ai"
            className="bg-white border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            AI Search
          </Link>

          <Link
            href="/leads"
            className="bg-white border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Leads
          </Link>

          <Link
            href="/exposure"
            className="bg-white border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Exposure
          </Link>

          <Link
            href="/action-center"
            className="bg-white border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Action Center
          </Link>

          <Link
            href="/recommendations"
            className="bg-white border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition col-span-2 sm:col-span-3"
          >
            Recommendations
          </Link>

        </div>

      </div>

    </main>
  );
}