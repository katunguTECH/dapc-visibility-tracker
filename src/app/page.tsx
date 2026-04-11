// src/app/page.tsx
"use client";

// REMOVED: export const dynamic = 'force-dynamic';
// REMOVED: export const fetchCache = 'force-no-store';  
// REMOVED: export const revalidate = 0;
// These are server-only directives and cannot be used with "use client"

import { useState, Suspense } from "react";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";

// Loading component
function LoadingState() {
  return (
    <div className="mt-6 p-8 bg-white rounded-2xl shadow-md text-center">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      <p className="text-gray-600 mt-4">Running visibility audit...</p>
    </div>
  );
}

// Error display component
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
      <h3 className="text-red-800 font-semibold mb-2">Audit Failed</h3>
      <p className="text-red-600">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

// No data state
function NoDataState() {
  return (
    <div className="mt-6 p-8 bg-gray-50 rounded-2xl text-center border border-gray-200">
      <p className="text-gray-600">
        Enter a business name above and click "Run Audit" to see visibility results
      </p>
    </div>
  );
}

// Header Component with Clerk authentication
function Header() {
  const { isSignedIn } = useAuth();
  
  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="relative w-10 h-10">
              <Image
                src="/dapc-logo.jpg"
                alt="DAPC Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DAPC
              </h1>
              <p className="text-xs text-gray-500">Visibility Tracker</p>
            </div>
          </a>

          {/* Navigation and Sign In */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition">About</a>
            </nav>
            
            {isSignedIn ? (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                  Dashboard
                </a>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-5 py-2 text-blue-600 font-medium hover:text-blue-700 transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-sm">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-sm text-blue-700 font-medium">AI-Powered Analysis</span>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
        Know Your Digital<br />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Visibility Score
        </span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Discover how visible your business is across search engines, Google Maps, and social media. 
        Get actionable insights to dominate your market.
      </p>
      
      <div className="flex gap-4 justify-center">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"></div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Trusted by <span className="font-semibold text-gray-900">500+</span> Kenyan businesses
        </p>
      </div>
    </div>
  );
}

// Stats Section
function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 border-y border-gray-100">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">94%</div>
        <div className="text-sm text-gray-500 mt-1">Accuracy Rate</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">500+</div>
        <div className="text-sm text-gray-500 mt-1">Businesses Audited</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">10K+</div>
        <div className="text-sm text-gray-500 mt-1">Audits Completed</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">24/7</div>
        <div className="text-sm text-gray-500 mt-1">Real-time Tracking</div>
      </div>
    </div>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🔍",
      title: "SEO Analysis",
      description: "Comprehensive SEO score with actionable recommendations"
    },
    {
      icon: "📍",
      title: "Google Maps Check",
      description: "Verify your business presence on Google Maps"
    },
    {
      icon: "📱",
      title: "Social Media Audit",
      description: "Track your brand across Facebook, X, Instagram & TikTok"
    },
    {
      icon: "🏆",
      title: "Competitor Tracking",
      description: "Compare your visibility against market competitors"
    },
    {
      icon: "📊",
      title: "Real-time Reports",
      description: "Get instant insights with detailed analytics"
    },
    {
      icon: "🚀",
      title: "Growth Recommendations",
      description: "Actionable steps to improve your visibility score"
    }
  ];

  return (
    <div id="features" className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
      <p className="text-gray-600 text-center mb-12">Everything you need to dominate your market</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition hover:border-blue-200 group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Search Section
function SearchSection({ 
  query, 
  setQuery, 
  loading, 
  onSearch 
}: { 
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  onSearch: () => void;
}) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border p-8 mb-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Run Your Visibility Audit</h2>
      <p className="text-gray-600 text-center mb-6">Enter any business name to get started</p>
      
      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
        <div className="flex-1">
          <input
            id="business"
            name="business"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Safaricom, Java House, KCB Bank"
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
            disabled={loading}
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          {loading ? "Analyzing..." : "Run Audit →"}
        </button>
      </div>
      
      <p className="text-xs text-gray-400 text-center mt-4">
        Free audit • No credit card required • Instant results
      </p>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = async () => {
    setError(null);
    setData(null);

    if (!query.trim()) {
      setError("Please enter a business name");
      return;
    }

    setLoading(true);

    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const res = await fetch(`/api/visibility?business=${encodedQuery}`);

      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      if (!json || typeof json !== "object") {
        throw new Error("Invalid API response format");
      }

      const validatedData = {
        business: json.business || query.trim(),
        score: typeof json.score === "number" ? json.score : 0,
        seoScore: typeof json.seoScore === "number" ? json.seoScore : 0,
        mapsPresence: typeof json.mapsPresence === "boolean" ? json.mapsPresence : false,
        social: {
          facebook: json.social?.facebook === true,
          twitter: json.social?.twitter === true,
          instagram: json.social?.instagram === true,
          tiktok: json.social?.tiktok === true,
        },
        competitors: Array.isArray(json.competitors) ? json.competitors : [],
      };

      setData(validatedData);
    } catch (err: any) {
      console.error("Audit error:", err);
      setError(err.message || "Failed to run visibility audit. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <HeroSection />
        <StatsSection />
        
        <SearchSection 
          query={query}
          setQuery={setQuery}
          loading={loading}
          onSearch={runAudit}
        />
        
        {error && <ErrorDisplay message={error} />}
        
        {loading && <LoadingState />}
        
        <div className="mt-6">
          <Suspense fallback={<LoadingState />}>
            {!loading && !error && data && <VisibilityCard {...data} />}
            {!loading && !error && !data && <NoDataState />}
          </Suspense>
        </div>
        
        <FeaturesSection />
        
        <div id="pricing" className="mt-12">
          <Pricing />
        </div>
        
        {/* Footer */}
        <footer id="about" className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; 2026 DAPC Visibility Tracker. All rights reserved.</p>
          <p className="mt-2">Empowering Kenyan businesses with data-driven insights</p>
        </footer>
      </main>
    </>
  );
}