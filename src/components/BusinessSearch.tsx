"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { isLoaded: sessionLoaded, session } = useSession();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  if (!sessionLoaded || !userLoaded) {
    return <div className="p-4 text-center text-slate-400">Loading Engine...</div>;
  }

  const handleAudit = async () => {
    if (!business) return;
    setLoading(true);
    setResult(null);

    try {
      const url = `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`;
      const response = await fetch(url);
      const data = await response.json();
      setResult(data);
      // NOTE: No router.push here anymore! Results stay on screen.
    } catch (error) {
      console.error("Audit Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Business Name"
          className="flex-1 p-4 rounded-xl border border-slate-200 outline-none text-slate-800"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="md:w-1/3 p-4 rounded-xl border border-slate-200 outline-none text-slate-800"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={handleAudit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl disabled:opacity-50"
        >
          {loading ? "Searching Google..." : "Run Visibility Audit"}
        </button>
      </div>

      {result && !loading && (
        <div className="animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase">Visibility Score</p>
              <p className="text-4xl font-black text-blue-900">{result.visibilityScore}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Maps Rank</p>
              <p className="text-lg font-bold text-slate-900">{result.ranking || "Top 20"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
              <p className="text-xs text-slate-500 font-bold uppercase">Public Trust</p>
              <p className="text-lg font-bold text-slate-900">{result.rating || "High"}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight">Audit Findings</h4>
            <p className="text-sm text-slate-500 mb-6 font-medium italic">Detailed report for {business} in {location}</p>
            
            <div className="space-y-3">
              {result.recs?.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-100">
                  <span>{rec.includes("✅") ? "✅" : "⚠️"}</span>
                  <p className="font-semibold">{rec.replace(/[✅❌⚠️]/g, "")}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (!session) router.push("/sign-in");
                else router.push("/subscribe");
              }}
              className="w-full mt-8 py-5 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
            >
              🚀 Unlock Full Competitor Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}