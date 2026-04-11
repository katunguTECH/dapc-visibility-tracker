"use client";

import { safeArray, safeNumber, safeObject, safeString } from "@/lib/safe";

export default function VisibilityCard(props: any) {
  const data = safeObject(props, null);
  if (!data) return null;

  const business = safeString(data.business, "Unknown Business");
  const score = safeNumber(data.score);
  const seoScore = safeNumber(data.seoScore);
  const mapsPresence = !!data.mapsPresence;

  const social = safeObject(data.social, {
    facebook: false,
    twitter: false,
    instagram: false,
    tiktok: false,
  });

  const competitors = safeArray(data.competitors);

  return (
    <div className="p-6 border rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold mb-2">{business}</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>📊 Score: {score}/100</div>
        <div>🔍 SEO: {seoScore}/100</div>
        <div>📍 Maps: {mapsPresence ? "Yes" : "No"}</div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Social Media</h3>
        <ul className="text-sm text-gray-600">
          <li>Facebook: {social.facebook ? "Active" : "Missing"}</li>
          <li>Twitter: {social.twitter ? "Active" : "Missing"}</li>
          <li>Instagram: {social.instagram ? "Active" : "Missing"}</li>
          <li>TikTok: {social.tiktok ? "Active" : "Missing"}</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Competitors</h3>
        <ul className="text-sm text-gray-600">
          {competitors.length === 0 ? (
            <li>No competitors found</li>
          ) : (
            competitors.map((c: any, i: number) => (
              <li key={i}>
                {c.name || "Unknown"} — {c.score || 0}%
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}