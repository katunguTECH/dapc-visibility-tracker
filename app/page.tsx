"use client";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/dapc-logo.jpg"
          alt="DAPC watermark"
          className="w-[600px] opacity-10 select-none"
        />
      </div>

      {/* Page Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Welcome to DAPC Visibility Tracker
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Track your business growth, analyze exposure, and unlock insights.
        </p>
      </div>
    </main>
  );
}