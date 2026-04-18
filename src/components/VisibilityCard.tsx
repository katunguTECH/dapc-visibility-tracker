// src/components/VisibilityCard.tsx
"use client";

import { useState } from 'react';

interface VisibilityCardProps {
  business: string;
  score: number;
  seoScore: number;
  mapsPresence: boolean;
  mapsUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  social: {
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
    tiktok: boolean;
  };
  competitors: Array<{ name: string; score: number }>;
  lastVerified?: string;
  dataSource?: string;
}

export default function VisibilityCard({
  business,
  score,
  seoScore,
  mapsPresence,
  mapsUrl,
  address,
  phone,
  email,
  website,
  social,
  competitors,
  lastVerified,
  dataSource,
}: VisibilityCardProps) {
  const [showCompetitors, setShowCompetitors] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    if (score >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  // Calculate circle circumference for score ring
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Visibility Report</h2>
            <p className="text-blue-100 text-sm mt-1">Powered by DAPC AI</p>
          </div>
          {lastVerified && (
            <div className="text-right">
              <p className="text-blue-100 text-xs">Last Verified</p>
              <p className="text-white text-sm font-medium">{lastVerified}</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{business}</h1>
            {address && <p className="text-sm text-gray-500 mt-1">{address}</p>}
          </div>
        </div>
      </div>

      {/* Main Score Section */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative flex-shrink-0">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${getScoreRingColor(score)} transition-all duration-1000`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-gray-400">/100</span>
              <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${getScoreBgColor(score)} ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-gray-500">SEO Score</span>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(seoScore)}`}>{seoScore}</p>
              <p className="text-xs text-gray-400 mt-1">/100</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-500">Google Maps</span>
              </div>
              {mapsPresence ? (
                <>
                  <p className="text-lg font-semibold text-green-600">Verified</p>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:text-blue-700 mt-1 inline-block"
                    >
                      View on Maps →
                    </a>
                  )}
                </>
              ) : (
                <p className="text-lg font-semibold text-red-500">Not Found</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Section */}
      {(phone || email || website) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {phone && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9" />
                </svg>
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Media Section - Updated with "Not Active" instead of X */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Social Media Presence
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Facebook */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${social.facebook ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Facebook</p>
              <p className={`text-sm font-medium ${social.facebook ? 'text-green-600' : 'text-gray-400'}`}>
                {social.facebook ? 'Active' : 'Not Active'}
              </p>
            </div>
          </div>

          {/* Twitter/X */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${social.twitter ? 'bg-sky-50' : 'bg-gray-50'}`}>
            <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Twitter/X</p>
              <p className={`text-sm font-medium ${social.twitter ? 'text-green-600' : 'text-gray-400'}`}>
                {social.twitter ? 'Active' : 'Not Active'}
              </p>
            </div>
          </div>

          {/* Instagram */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${social.instagram ? 'bg-pink-50' : 'bg-gray-50'}`}>
            <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Instagram</p>
              <p className={`text-sm font-medium ${social.instagram ? 'text-green-600' : 'text-gray-400'}`}>
                {social.instagram ? 'Active' : 'Not Active'}
              </p>
            </div>
          </div>

          {/* TikTok */}
          <div className={`flex items-center gap-2 p-3 rounded-lg ${social.tiktok ? 'bg-gray-100' : 'bg-gray-50'}`}>
            <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.2 20.22a6.34 6.34 0 0010.6-4.45v-7a8.16 8.16 0 004.7 1.33v-3.4a4.85 4.85 0 01-.91-.01z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">TikTok</p>
              <p className={`text-sm font-medium ${social.tiktok ? 'text-green-600' : 'text-gray-400'}`}>
                {social.tiktok ? 'Active' : 'Not Active'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors Section */}
      {competitors && competitors.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => setShowCompetitors(!showCompetitors)}
            className="w-full flex items-center justify-between text-left"
          >
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Competitor Analysis
            </h3>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showCompetitors ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCompetitors && (
            <div className="mt-3 space-y-2">
              {competitors.map((competitor, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{competitor.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${competitor.score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{competitor.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Competitors Message */}
      {(!competitors || competitors.length === 0) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <p className="text-sm">No competitor data available</p>
          </div>
        </div>
      )}

      {/* Data Source Footer */}
      {dataSource && (
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs text-gray-500">
                {dataSource === 'verified_business_database' 
                  ? '✓ Verified Business Data' 
                  : '🌐 Real-time Search Results'}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Powered by DAPC AI Engine
            </p>
          </div>
        </div>
      )}
    </div>
  );
}