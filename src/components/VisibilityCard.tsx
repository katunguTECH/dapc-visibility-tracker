"use client";

type Props = {
  data: any;
};

export default function VisibilityCard({ data }: Props) {
  if (!data) return null;

  const { business, score, seoScore, mapsPresence, social, competitors } = data;

  const socials = [
    {
      name: "facebook",
      label: "Facebook",
      active: social?.facebook,
      icon: "/icons/facebook.svg",
    },
    {
      name: "x",
      label: "X",
      active: social?.twitter,
      icon: "/icons/x.svg",
    },
    {
      name: "instagram",
      label: "Instagram",
      active: social?.instagram,
      icon: "/icons/instagram.svg",
    },
    {
      name: "tiktok",
      label: "TikTok",
      active: social?.tiktok,
      icon: "/icons/tiktok.svg",
    },
  ];

  return (
    <div className="mt-10 p-6 rounded-2xl shadow-lg bg-white border">
      <h2 className="text-2xl font-bold mb-4">
        Visibility Report: {business}
      </h2>

      <div className="mb-6">
        <p className="text-gray-500">Overall Score</p>
        <h3 className="text-4xl font-bold">{score}/100</h3>
      </div>

      <div className="mb-6">
        <p className="font-semibold">SEO Performance</p>
        <p className="text-gray-600">
          Your business has a visibility score of {seoScore}% compared to local competitors.
        </p>
      </div>

      <div className="mb-6">
        <p className="font-semibold">Google Maps</p>
        <p className={mapsPresence ? "text-green-600" : "text-red-500"}>
          {mapsPresence ? "Listed" : "Not Found"}
        </p>
      </div>

      <div className="mb-6">
        <p className="font-semibold mb-2">Social Media Footprint</p>

        <div className="flex gap-6">
          {socials.map((s) => (
            <div key={s.name} className="text-center">
              <img
                src={s.icon}
                alt={s.name}
                className={`w-6 h-6 mx-auto mb-1 ${
                  s.active ? "opacity-100" : "opacity-30 grayscale"
                }`}
              />
              <p className="text-xs">{s.label}</p>
              <p className="text-xs">
                {s.active ? "Active" : "Missing"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2">Local Competitors</p>

        <div className="space-y-2">
          {competitors?.map((c: any, i: number) => (
            <div
              key={i}
              className="flex justify-between bg-gray-50 p-2 rounded"
            >
              <span>{c.name}</span>
              <span className="font-semibold">{c.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}