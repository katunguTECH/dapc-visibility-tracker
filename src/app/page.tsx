"use client";
import React, { useState } from 'react';
import CompetitorTable from '@/components/CompetitorTable';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const startAudit = async () => {
    if (!query) return;
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(`/api/audit?business=${encodeURIComponent(query)}`);
      const result = await res.json();
      setData(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Search Box */}
      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            className="flex-1 bg-slate-50 px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none font-medium"
            placeholder="Search your business (e.g. Java House)..."
            value={query} onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={startAudit} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify Market Position"}
          </button>
        </div>
      </div>

      {/* Results Rendering */}
      {data && (
        data.score === 0 ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-700 flex gap-3">
            <AlertCircle /> <div><strong>Verification Failed:</strong> We couldn't find a legitimate business matching that name.</div>
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-8 rounded-3xl border text-center">
                  <span className="text-xs uppercase font-black text-slate-400">Impact Score</span>
                  <div className="text-6xl font-black text-blue-600 mt-2">{data.score}%</div>
               </div>
               <div className="bg-white p-8 rounded-3xl border flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-slate-900">{data.businessName}</h2>
                  <div className="text-blue-600 font-bold mt-1">{data.rank}</div>
                  <p className="text-sm text-slate-500 mt-2">📍 {data.address}</p>
               </div>
            </div>

            {/* Competitor Table Component */}
            {data.competitors && (
              <CompetitorTable 
                competitors={data.competitors} 
                currentBusiness={data.businessName} 
              />
            )}
          </>
        )
      )}
    </div>
  );
}