"use client";

import Image from "next/image";

interface ReportProps {
  data: any;
}

export default function Report({ data }: ReportProps) {
  // GUARD: Prevents the "client-side exception" if data isn't fully loaded yet
  if (!data || !data.social) {
    return (
      <div className="max-w-7xl mx-auto p-10 text-center animate-pulse text-gray-400">
        Generating your visibility report...
      </div>
    );
  }

  const { business, score, seoScore, mapsPresence, social, competitors } = data;

  // Helper for status icons
  const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
      active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>
      {active ? "Active" : "Missing"}
    </span>
  );

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 mb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-50 gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
            Visibility Report: <span className="text-blue-700">{business}</span>
          </h2>
          <p className="text-gray-500 font-medium">Real-time audit for the Nairobi market</p>
        </div>
        <div className="bg-blue-700 text-white p-6 rounded-2xl text-center min-w-[160px] shadow-lg shadow-blue-200">
          <p className="text-sm font-bold uppercase opacity-80 mb-1">Overall Score</p>
          <p className="text-4xl font-black">{score}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* SEO Score Card */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             SEO Performance
          </h3>
          <div className="bg-gray-200 h-4 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-green-500 h-full transition-all duration-1000" 
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>
          <p className="text-gray-600 font-medium">
            Your business has a visibility score of <span className="text-gray-900 font-bold">{seoScore}%</span> compared to local competitors.
          </p>
        </div>

        {/* Google Maps Card */}
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Google Maps</h3>
            <p className="text-gray-500">Business Listing Status</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-black mb-1 ${mapsPresence ? "text-green-600" : "text-red-600"}`}>
              {mapsPresence ? "Verified" : "Not Found"}
            </div>
            <StatusBadge active={mapsPresence} />
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-black mb-8 tracking-tighter">Social Media Footprint</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(social).map(([platform, present]: [string, any]) => (
            <div key={platform} className="p-6 bg-white border border-gray-100 rounded-3xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-50 rounded-2xl">
                <Image
                  src={`/icons/${platform}.svg`}
                  alt={platform}
                  width={40}
                  height={40}
                  className={present ? "opacity-100" : "opacity-30 grayscale"}
                />
              </div>
              <span className="text-lg font-bold capitalize mb-2">{platform}</span>
              <StatusBadge active={present} />
            </div>
          ))}
        </div>
      </div>

      {/* Competitors Section */}
      <div>
        <h3 className="text-2xl font-black mb-8 tracking-tighter">Local Competitors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitors && competitors.length > 0 ? (
            competitors.map((comp: any) => (
              <div key={comp.name} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-2 truncate">{comp.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full" style={{ width: `${comp.score}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-blue-700">{comp.score}%</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No local competitors found in this niche.</p>
          )}
        </div>
      </div>
    </section>
  );
}