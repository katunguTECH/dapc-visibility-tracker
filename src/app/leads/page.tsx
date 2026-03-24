// src/app/leads/page.tsx
"use client";

import React from "react";
import BusinessSearch from "@/components/BusinessSearch";

export default function LeadsPage() {
  return (
    <main className="max-w-5xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-extrabold tight-heading text-slate-900 mb-6">
          Discover Your <span className="text-blue-600 italic">Business Visibility</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
          Audit your online presence across Google and social media. Turn low visibility into actionable leads.
        </p>
      </div>

      <div className="mb-32">
        <BusinessSearch />
      </div>
    </main>
  );
}