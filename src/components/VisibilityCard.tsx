"use client";

import React from "react";

interface SocialStatus {
  facebook?: boolean;
  twitter?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
}

interface Competitor {
  name: string;
  score: number;
}

export interface VisibilityData {
  business?: string;
  score?: number;
  seoScore?: number;
  mapsPresence?: boolean;
  social?: SocialStatus;
  competitors?: Competitor[];
}

export default function VisibilityCard(props: VisibilityData) {
  // 🛡️ SAFETY DEFAULTS (CRITICAL FIX FOR REACT #130)
  const {
    business = "Unknown Business",
    score = 0,
    seoScore = 0,
    mapsPresence = false,
    social = {
      facebook: false,
      twitter: false,
      instagram: false,
      tiktok: false,
    },
    competitors = [],
  } = props || {};

  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white">
      {/* BUSINESS NAME SAFE */}
      <h2 className="text-xl font-bold mb-4">
        {business || "Unknown Business"}
      </h2>

      {/* SCORES */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">Overall Score</p>
          <p className="text-2xl font-bold text-blue-600">
            {score}/100
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500">SEO Score</p>
          <p className="text-2xl font-bold text-green-600">
            {seoScore}/100
          </p>
        </div>
      </div>

      {/* MAPS */}
      <div className="mb-4 p-3 border rounded-xl">
        <strong>Google Maps:</strong>{" "}
        {mapsPresence ? "Visible" : "Not Found"}
      </div>

      {/* SOCIAL */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <p className="font-semibold mb-2">Social Media</p>
        <ul className="text-sm space-y-1">
          <li>Facebook: {social.facebook ? "Active" : "Missing"}</li>
          <li>Twitter/X: {social.twitter ? "Active" : "Missing"}</li>
          <li>Instagram: {social.instagram ? "Active" : "Missing"}</li>
          <li>TikTok: {social.tiktok ? "Active" : "Missing"}</li>
        </ul>
      </div>

      {/* COMPETITORS */}
      <div className="p-4 border rounded-xl">
        <p className="font-semibold mb-2">Competitors</p>

        {competitors.length === 0 ? (
          <p className="text-sm text-gray-400">
            No competitor data available
          </p>
        ) : (
          <ul className="text-sm space-y-1">
            {competitors.map((c, i) => (
              <li key={`${c.name}-${i}`}>
                {c.name || "Unknown"}: {c.score ?? 0}%
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}