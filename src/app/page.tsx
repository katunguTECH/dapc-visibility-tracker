"use client";

import Navbar from "@/components/Navbar";
import BusinessSearch from "@/components/BusinessSearch";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <BusinessSearch />
      </div>

    </main>
  );
}