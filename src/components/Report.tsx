"use client";

import Image from "next/image";

interface ReportProps {
  data: any;
}

export default function Report({ data }: ReportProps) {
  const { business, score, seoScore, mapsPresence, social, competitors } = data;

  return (
    <section className="py-10 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow mb-20">
      <h2 className="text-2xl font-bold mb-6">Visibility Report: {business}</h2>
      <p className="mb-4 text-gray-700">Overall Visibility Score: <strong>{score}/100</strong></p>

      <div className="mb-6">
        <h3 className="font-bold mb-2">SEO Score</h3>
        <div className="bg-gray-200 h-6 rounded-full overflow-hidden">
          <div className="bg-green-500 h-6" style={{ width: `${seoScore}%` }}></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Google Maps Presence</h3>
        <p>{mapsPresence ? "Listed on Google Maps" : "Not found on Google Maps"}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-2">Social Media Presence</h3>
        <div className="flex gap-4">
          {Object.entries(social).map(([platform, present]: [string, boolean]) => (
            <div key={platform} className="flex flex-col items-center">
              <Image
                src={`/icons/${platform}.svg`}
                alt={platform}
                width={40}
                height={40}
              />
              <span className="text-sm">{present ? "Active" : "Missing"}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Competitor Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competitors.map((comp: any) => (
            <div key={comp.name} className="p-4 border rounded-lg text-center">
              <p className="font-bold">{comp.name}</p>
              <p>Visibility: {comp.score}/100</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

