import React from "react";

interface SocialStatus {
  facebook: boolean;
  twitter: boolean;
  instagram: boolean;
  tiktok: boolean;
}

interface Competitor {
  name: string;
  score: number;
}

interface VisibilityCardProps {
  business: string;
  score: number;
  seoScore: number;
  mapsPresence: boolean;
  social: SocialStatus;
  competitors: Competitor[];
}

export const VisibilityCard: React.FC<VisibilityCardProps> = ({
  business,
  score,
  seoScore,
  mapsPresence,
  social,
  competitors,
}) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, maxWidth: 400 }}>
      <h2>{business}</h2>
      <p>
        <strong>Overall Score:</strong> {score}/100
      </p>
      <p>
        <strong>SEO Score:</strong> {seoScore}/100
      </p>
      <p>
        <strong>Google Maps Presence:</strong> {mapsPresence ? "Yes" : "No"}
      </p>
      <div>
        <strong>Social Media:</strong>
        <ul>
          <li>Facebook: {social.facebook ? "Active" : "Missing"}</li>
          <li>Twitter/X: {social.twitter ? "Active" : "Missing"}</li>
          <li>Instagram: {social.instagram ? "Active" : "Missing"}</li>
          <li>TikTok: {social.tiktok ? "Active" : "Missing"}</li>
        </ul>
      </div>
      <div>
        <strong>Competitors:</strong>
        <ul>
          {competitors.map((c) => (
            <li key={c.name}>
              {c.name}: {c.score}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};