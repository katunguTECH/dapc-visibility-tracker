// src/app/dashboard/page.tsx
"use client";

import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface VisibilityProfile {
  business: string;
  score: number;
  seoScore: number;
  mapsPresence: boolean;
  social: {
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
    tiktok: boolean;
  };
  lastUpdated: string;
}

interface Recommendation {
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

// Admin emails (keep existing)
const ADMIN_EMAILS = [ ... ]; // same as before

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<VisibilityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    // Check admin
    if (user?.primaryEmailAddress?.emailAddress) {
      setIsAdmin(ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress));
    }

    // Load visibility profile from user metadata
    const metadata = user?.publicMetadata as any;
    if (metadata?.visibilityProfile) {
      setProfile(metadata.visibilityProfile);
    }
    setLoading(false);
  }, [isSignedIn, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Generate personalized recommendations based on audit weaknesses
  const getRecommendations = (): Recommendation[] => {
    if (!profile) return [];

    const recs: Recommendation[] = [];

    if (profile.score < 50) {
      recs.push({
        title: "Improve Overall Visibility",
        description: "Your current score is low. Focus on the basics first.",
        action: "Claim and verify your Google Business Profile.",
        priority: "high",
      });
    }
    if (profile.seoScore < 60) {
      recs.push({
        title: "Boost SEO",
        description: "Your SEO score needs attention.",
        action: "Add meta tags, improve page speed, and use local keywords.",
        priority: "high",
      });
    }
    if (!profile.mapsPresence) {
      recs.push({
        title: "Get on Google Maps",
        description: "Customers can't find you on maps.",
        action: "Create/claim your Google Maps listing and verify it.",
        priority: "high",
      });
    }
    if (!profile.social.facebook) {
      recs.push({
        title: "Activate Facebook Presence",
        description: "Missing Facebook page.",
        action: "Create a Facebook Business Page and post regularly.",
        priority: "medium",
      });
    }
    if (!profile.social.instagram) {
      recs.push({
        title: "Use Instagram for Visual Branding",
        description: "No Instagram account detected.",
        action: "Set up an Instagram business profile linked to Facebook.",
        priority: "medium",
      });
    }
    if (!profile.social.twitter) {
      recs.push({
        title: "Engage on X (Twitter)",
        description: "Twitter/X presence missing.",
        action: "Create a business account and share industry insights.",
        priority: "low",
      });
    }
    if (!profile.social.tiktok && profile.score > 40) {
      recs.push({
        title: "Expand to TikTok",
        description: "Reach younger audiences.",
        action: "Start short-form video content relevant to your niche.",
        priority: "low",
      });
    }
    if (recs.length === 0) {
      recs.push({
        title: "You're doing great!",
        description: "Your visibility is strong. Keep monitoring.",
        action: "Run a new audit in 30 days to track improvements.",
        priority: "low",
      });
    }
    return recs;
  };

  const recommendations = getRecommendations();
  const userName = user?.fullName || user?.firstName || "Valued Customer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (same as before) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/dapc-logo2.jpg" alt="DAPC Logo" className="w-10 h-10 object-contain rounded-lg" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DAPC</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              {isAdmin && (
                <Link href="/admin/reports" className="text-gray-600 hover:text-blue-600 font-medium">Reports</Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + Profile Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello, {userName} 👋</h1>
          <p className="text-gray-600 mt-1">Here's your personal visibility profile and action plan.</p>
        </div>

        {profile ? (
          <>
            {/* Visibility Score Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p className="text-sm opacity-90">Your Business</p>
                  <h2 className="text-2xl font-bold">{profile.business}</h2>
                  <p className="text-sm opacity-75 mt-1">Last audit: {new Date(profile.lastUpdated).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Overall Visibility Score</p>
                  <p className="text-5xl font-black">{profile.score}</p>
                  <p className="text-xs opacity-75">out of 100</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs opacity-75">SEO Score</p>
                  <p className="text-xl font-bold">{profile.seoScore}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Google Maps</p>
                  <p className="text-xl font-bold">{profile.mapsPresence ? "✅ Yes" : "❌ No"}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Social Presence</p>
                  <p className="text-xl font-bold">{Object.values(profile.social).filter(Boolean).length}/4</p>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">📋 Recommended Actions</h2>
                <p className="text-gray-600 text-sm mt-1">Based on your audit, these steps will increase your visibility.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {rec.priority === "high" && <span className="inline-flex h-2 w-2 rounded-full bg-red-500 mt-2"></span>}
                        {rec.priority === "medium" && <span className="inline-flex h-2 w-2 rounded-full bg-yellow-500 mt-2"></span>}
                        {rec.priority === "low" && <span className="inline-flex h-2 w-2 rounded-full bg-green-500 mt-2"></span>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{rec.description}</p>
                        <div className="mt-2 bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>✍️ Action:</strong> {rec.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <Link href="/" className="block">
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Run New Audit</h3>
                  <p className="text-sm text-gray-500 mt-1">Update your visibility score</p>
                </div>
              </Link>
              <button
                onClick={() => window.location.href = "/subscribe"}
                className="block"
              >
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Upgrade Plan</h3>
                  <p className="text-sm text-gray-500 mt-1">Get more advanced tracking</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          // No profile yet – prompt to run first audit
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Visibility Profile Yet</h2>
            <p className="text-gray-600">Run your first visibility audit to get personalized recommendations.</p>
            <Link href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Run Audit Now
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}