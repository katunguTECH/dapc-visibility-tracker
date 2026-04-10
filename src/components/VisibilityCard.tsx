
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaMapMarkerAlt,
} from "react-icons/fa6";

export const VisibilityCard = ({
  business,
  score,
  seoScore,
  mapsPresence,
  social,
  competitors,
}: any) => {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-lg space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold">{business}</h2>
        <p className="text-gray-500 text-sm">Visibility Report</p>
      </div>

      {/* SCORES */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm">Overall</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {score}/100
          </h3>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm">SEO Score</p>
          <h3 className="text-2xl font-bold text-green-600">
            {seoScore}/100
          </h3>
        </div>
      </div>

      {/* MAPS */}
      <div className="flex items-center gap-2">
        <FaMapMarkerAlt className="text-red-500" />
        <span>Google Maps:</span>
        <span className={mapsPresence ? "text-green-600" : "text-red-500"}>
          {mapsPresence ? "Listed" : "Missing"}
        </span>
      </div>

      {/* SOCIAL */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <SocialIcon icon={<FaFacebook />} active={social.facebook} />
        <SocialIcon icon={<FaXTwitter />} active={social.twitter} />
        <SocialIcon icon={<FaInstagram />} active={social.instagram} />
        <SocialIcon icon={<FaTiktok />} active={social.tiktok} />
      </div>

      {/* COMPETITORS */}
      <div>
        <h3 className="font-semibold mb-2">Competitors</h3>

        <div className="space-y-1">
          {competitors.map((c: any, i: number) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{c.name}</span>
              <span className="font-bold">{c.score}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

function SocialIcon({
  icon,
  active,
}: {
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-xl text-xl flex justify-center ${
        active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
      }`}
    >
      {icon}
    </div>
  );
}