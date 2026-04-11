import React from "react";

export function VisibilityCard({
  business,
  score,
  seoScore,
  mapsPresence,
  social,
  competitors,
}: any) {
  if (!business) return null; // 🛡️ prevent crash

  return (
    <div className="border p-5 rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold mb-2">{business}</h2>

      <p><strong>Overall Score:</strong> {score}/100</p>
      <p><strong>SEO Score:</strong> {seoScore}/100</p>
      <p><strong>Google Maps:</strong> {mapsPresence ? "Yes" : "No"}</p>

      <div className="mt-3">
        <strong>Social Media:</strong>
        <ul className="text-sm text-gray-600">
          <li>Facebook: {social?.facebook ? "Active" : "Missing"}</li>
          <li>Twitter: {social?.twitter ? "Active" : "Missing"}</li>
          <li>Instagram: {social?.instagram ? "Active" : "Missing"}</li>
          <li>TikTok: {social?.tiktok ? "Active" : "Missing"}</li>
        </ul>
      </div>

      <div className="mt-3">
        <strong>Competitors:</strong>
        <ul className="text-sm text-gray-600">
          {competitors?.map((c: any, i: number) => (
            <li key={i}>{c.name}: {c.score}%</li>
          ))}
        </ul>
      </div>
    </div>
  );
}