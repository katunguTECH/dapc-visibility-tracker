"use client";

import React, { useState } from 'react';
import LeadsSection from '@/components/LeadsSection'; // The UI we just built
import { Search, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VisibilityPage() {
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("Nairobi");
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  const runAudit = async () => {
    if (!business) return alert("Please enter a business name");
    
    setLoading(true);
    setAuditData(null);

    try {
      const response = await fetch(`/api/audit?business=${encodeURIComponent(business)}&location=${encodeURIComponent(location)}`);
      const data = await response.json();
      setAuditData(data);
    } catch (error) {
      console.error("Audit failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      {/* Search Header */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Market Visibility Audit</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Business Name (e.g. Java House)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />
          <button 
            onClick={runAudit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Search className="mr-2" size={18} />}
            Run Audit
          </button>
        </div>
      </div>

      {/* Audit Results Display */}
      {auditData && (
        <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
          
          {/* Main Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-slate-500 uppercase">Visibility Score</span>
            <div className={`text-5xl font-black mt-2 ${auditData.score > 70 ? 'text-green-600' : 'text-orange-500'}`}>
              {auditData.score}%
            </div>
            <div className="mt-4 text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600 uppercase">
              {auditData.rank}
            </div>
          </div>

          {/* Validation Status Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4">
              {auditData.score > 10 ? (
                <CheckCircle2 className="text-green-500 shrink-0" size={24} />
              ) : (
                <AlertCircle className="text-red-500 shrink-0" size={24} />
              )}
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {auditData.score > 10 ? auditData.businessName : "Match Failed"}
                </h3>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                  {auditData.status || "Your digital presence is healthy. We found verified contact details and search engine indexing for this entity."}
                </p>
                {auditData.address && (
                  <div className="mt-3 text-xs text-slate-400 font-mono italic">
                    📍 {auditData.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table - Only show if it's a real match */}
      {auditData && auditData.score > 10 && (
        <LeadsSection leads={[auditData]} /> 
      )}
    </div>
  );
}