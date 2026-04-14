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
  score?: number | null;
  seoScore?: number | null;
  mapsPresence?: boolean;
  mapsUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  social?: SocialStatus;
  competitors?: Competitor[];
  needsVerification?: boolean;
  message?: string;
  dataSource?: string;
}

export default function VisibilityCard(props: VisibilityData) {
  const {
    business = "Unknown Business",
    score,
    seoScore,
    mapsPresence = false,
    mapsUrl,
    address,
    phone,
    email,
    website,
    social = {
      facebook: false,
      twitter: false,
      instagram: false,
      tiktok: false,
    },
    competitors = [],
    needsVerification = false,
    message,
    dataSource,
  } = props || {};

  // Check if we have valid scores
  const hasValidData = score !== null && score !== undefined && seoScore !== null && seoScore !== undefined;

  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white">
      {/* BUSINESS NAME */}
      <h2 className="text-xl font-bold mb-2">
        {business || "Unknown Business"}
      </h2>
      
      {/* Data source badge */}
      {dataSource && (
        <p className="text-xs text-gray-400 mb-4">
          Source: {dataSource === "verified_business_database" ? "✓ Verified" : "Unverified"}
        </p>
      )}

      {/* NEEDS VERIFICATION MESSAGE */}
      {needsVerification && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700">
          <p className="text-sm font-medium">⚠️ Data Needs Verification</p>
          <p className="text-xs mt-1">{message || "Please submit accurate business information."}</p>
        </div>
      )}

      {/* SCORES - Only show if valid */}
      {hasValidData ? (
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
      ) : (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-sm text-gray-500">No verified scores available</p>
        </div>
      )}

      {/* CONTACT INFO (if available) */}
      {(address || phone || email || website) && (
        <div className="mb-4 p-3 border rounded-xl">
          <p className="font-semibold mb-2">Business Information</p>
          {address && <p className="text-sm">📍 {address}</p>}
          {phone && <p className="text-sm">📞 {phone}</p>}
          {email && <p className="text-sm">✉️ {email}</p>}
          {website && (
            <p className="text-sm">
              🌐 <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {website}
              </a>
            </p>
          )}
        </div>
      )}

      {/* MAPS */}
      <div className="mb-4 p-3 border rounded-xl">
        <strong>Google Maps:</strong>{" "}
        {mapsPresence ? (
          <span className="text-green-600">
            ✓ Found
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 text-sm underline">
                View Map
              </a>
            )}
          </span>
        ) : (
          <span className="text-red-600">✗ Not Found</span>
        )}
      </div>

      {/* SOCIAL MEDIA */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <p className="font-semibold mb-2">Social Media</p>
        <ul className="text-sm space-y-1">
          <li>Facebook: {social.facebook ? "✅ Active" : "❌ Missing"}</li>
          <li>Twitter/X: {social.twitter ? "✅ Active" : "❌ Missing"}</li>
          <li>Instagram: {social.instagram ? "✅ Active" : "❌ Missing"}</li>
          <li>TikTok: {social.tiktok ? "✅ Active" : "❌ Missing"}</li>
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