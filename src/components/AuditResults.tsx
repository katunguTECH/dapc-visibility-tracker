"use client";

import { useEffect, useState } from "react";

export default function AuditResults({ data }: any) {
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("dapc_subscription");
    if (stored) {
      setSubscription(JSON.parse(stored));
    }
  }, []);

  const isPro = subscription?.status === "Active";

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl">
      
      <h2 className="text-2xl font-black mb-2">
        Business Visibility Audit
      </h2>

      <p className="text-gray-500 mb-6">
        Analysis for: <span className="font-bold">{data.business}</span> ({data.location})
      </p>

      {/* SCORE */}
      <div className="text-center mb-8">
        <h3 className="text-5xl font-black text-green-600">
          {data.score}/100
        </h3>
        <p className="text-gray-500">Visibility Score</p>
      </div>

      {/* BASIC BREAKDOWN */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-xl">🌐 Website: {data.breakdown.website}/20</div>
        <div className="p-4 bg-gray-50 rounded-xl">🔍 Search: {data.breakdown.search}/20</div>
        <div className="p-4 bg-gray-50 rounded-xl">📍 Maps: {data.breakdown.maps}/20</div>
        <div className="p-4 bg-gray-50 rounded-xl">📱 Social: {data.breakdown.social}/20</div>
        <div className="p-4 bg-gray-50 rounded-xl col-span-2">⚙️ SEO: {data.breakdown.seo}/20</div>
      </div>

      {/* 🔥 PRO SECTION */}
      <div className="mt-8 p-6 border-2 border-dashed rounded-xl bg-gray-50">

        <h3 className="text-lg font-bold mb-4">
          🚀 Pro Insights
        </h3>

        {!isPro ? (
          <>
            <p className="text-gray-500 mb-4">
              Unlock competitor rankings, keyword gaps, and real customer leads.
            </p>

            <ul className="text-sm text-gray-600 mb-4 list-disc ml-5">
              <li>Top competitors in your area</li>
              <li>High-converting keywords</li>
              <li>Customer demand insights</li>
              <li>Lead opportunities</li>
            </ul>

            <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">
              Unlock Full Pro Audit
            </button>
          </>
        ) : (
          <>
            {/* 🔓 UNLOCKED CONTENT */}
            <div className="space-y-4 text-sm text-gray-700">

              <div>
                <strong>Top Competitors:</strong>
                <ul className="list-disc ml-5">
                  <li>Jumia Kenya</li>
                  <li>Kilimall</li>
                  <li>PhonePlace Nairobi</li>
                </ul>
              </div>

              <div>
                <strong>Keyword Opportunities:</strong>
                <ul className="list-disc ml-5">
                  <li>“phones on installment Kenya”</li>
                  <li>“cheap smartphones Nairobi”</li>
                  <li>“lipa mdogo mdogo phones”</li>
                </ul>
              </div>

              <div>
                <strong>Lead Insight:</strong>
                <p>
                  High demand from Nairobi CBD and Eastlands for affordable smartphones.
                </p>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}