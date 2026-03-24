"use client";

import { useState, useEffect } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function BusinessSearch() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [leadsUnlocked, setLeadsUnlocked] = useState(false);

  const { isLoaded: sessionLoaded, session } = useSession();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  // Guard: If Clerk isn't loaded yet, don't render the interactive parts
  // This prevents the "Prerender Error" during npm run build
  if (!sessionLoaded || !userLoaded) {
    return <div className="p-8 text-center text-slate-400">Loading search engine...</div>;
  }

  const checkSubscription = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/check-subscription?userId=${user.id}`);
      const data = await res.json();
      return data.active;
    } catch (e) {
      return false;
    }
  };

  const handleAudit = async () => {
    if (!business) return;
    setLoading(true);
    setResult(null);

    try {
      const url = `/api/visibility?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`;
      const response = await fetch(url);
      const data = await response.json();
      setResult(data);

      if (!session) {
        router.push(`/sign-in`);
      } else {
        const hasSubscription = await checkSubscription();
        setLeadsUnlocked(hasSubscription);
        if (!hasSubscription) router.push("/subscribe");
      }
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
          {loading ? "Processing..." : "Run Visibility Audit"}
        </button>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
          <div className="grid grid-cols-3 gap-4 mb-4">
             <div className="text-center">
                <p className="text-xs font-bold text-blue-600 uppercase">Score</p>
                <p className="text-3xl font-black">{result.visibilityScore}%</p>
             </div>
             {/* Add other result displays here */}
          </div>
        </div>
      )}
    </div>
  );
}