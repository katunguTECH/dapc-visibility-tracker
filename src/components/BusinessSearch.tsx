"use client";

import { useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [leadsUnlocked, setLeadsUnlocked] = useState(false);

  const { session } = useSession();
  const { user } = useUser();
  const router = useRouter();

  // Placeholder for subscription check
  const checkSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    const res = await fetch(`/api/check-subscription?userId=${user.id}`);
    const data = await res.json();
    return data.active;
  };

  const handleAudit = async () => {
    if (!business) return;

    setLoading(true);
    setResult(null);
    setLeadsUnlocked(false);

    try {
      // Fetch visibility
      const url = `/api/visibility?business=${encodeURIComponent(
        business
      )}&location=${encodeURIComponent(location)}&t=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      setResult(data);

      // Auto-unlock leads if user is subscribed
      if (!session) {
        router.push(`/sign-in?redirect_url=/subscribe`);
      } else {
        const hasSubscription = await checkSubscription();
        if (hasSubscription) {
          setLeadsUnlocked(true);
        } else {
          router.push("/subscribe");
        }
      }
    } catch (error) {
      console.error("Audit UI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
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
          {loading ? "Processing..." : "Run Visibility Audit"}
        </button>
      </div>

      {loading && (
        <div className="py-10 text-center text-slate-400 animate-pulse">
          🔍 Scanning Google for {business}...
        </div>
      )}

      {result && !loading && (
        <div key={Date.now()} className="animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-100">
              <p className="text-xs text-blue-600 font-bold uppercase">Score</p>
              <p className="text-4xl font-black text-blue-900">{result.visibilityScore}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-bold uppercase">Maps Rank</p>
              <p className="text-lg font-bold text-slate-900">{result.ranking || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-xs text-slate-500 font-bold uppercase">Trust</p>
              <p className="text-lg font-bold text-slate-900">{result.rating || "N/A"}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-left">
            <h4 className="font-bold text-slate-900 mb-4">Live Insights for {business}</h4>
            <div className="space-y-3">
              {result.recs?.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span>{rec.includes("✅") ? "✅" : "⚠️"}</span>
                  <p>{rec.replace(/[✅❌⚠️]/g, "")}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => leadsUnlocked && router.push("/dashboard")}
              disabled={!leadsUnlocked}
              className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${
                leadsUnlocked
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-400 text-slate-200 cursor-not-allowed"
              }`}
            >
              🚀 {leadsUnlocked ? `Find Leads for ${business} →` : "Unlock Leads with Subscription"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}