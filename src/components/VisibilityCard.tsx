"use client";

import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaMapMarkerAlt,
} from "react-icons/fa6";

export default function VisibilityCard({
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
}: any) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-lg space-y-6">

      <h2 className="text-xl font-bold">{business}</h2>

      {/* SCORES */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p>Overall</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {score}/100
          </h3>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p>SEO Score</p>
          <h3 className="text-2xl font-bold text-green-600">
            {seoScore}/100
          </h3>
        </div>
      </div>

      {/* MAPS */}
      <div className="flex gap-2 items-center">
        <FaMapMarkerAlt />
        <span>
          Google Maps:
        </span>
        <span className={mapsPresence ? "text-green-600" : "text-red-500"}>
          {mapsPresence ? "Listed" : "Missing"}
        </span>
      </div>

      {/* SOCIAL */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <Icon icon={<FaFacebook />} active={social.facebook} />
        <Icon icon={<FaXTwitter />} active={social.twitter} />
        <Icon icon={<FaInstagram />} active={social.instagram} />
        <Icon icon={<FaTiktok />} active={social.tiktok} />
      </div>

      {/* COMPETITORS */}
      <div>
        <h3 className="font-bold mb-2">Competitors</h3>

        {competitors.length === 0 ? (
          <p className="text-gray-400 text-sm">No competitors found</p>
        ) : (
          competitors.map((c: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{c.name}</span>
              <span className="font-bold">{c.score}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Icon({ icon, active }: any) {
  return (
    <div
      className={`p-3 rounded-xl flex justify-center text-xl ${
        active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
      }`}
    >
      {icon}
    </div>
  );
}