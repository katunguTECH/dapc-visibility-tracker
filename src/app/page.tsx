// src/app/page.tsx
"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/nextjs';
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";
import TermsModal from "@/components/TermsModal";

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
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
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

// Header Component with Clerk authentication and Terms modal
function Header() {
  const { isSignedIn } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [pendingAction, setPendingAction] = useState<'signin' | 'signup' | null>(null);
  
  // Store terms acceptance in localStorage
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  // Check localStorage on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setHasAcceptedTerms(localStorage.getItem('termsAccepted') === 'true');
    }
  });

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setShowTerms(false);
    if (pendingAction === 'signin') {
      // Trigger sign in
      const signInButton = document.querySelector('[data-clerk-sign-in]') as HTMLElement;
      if (signInButton) signInButton.click();
    } else if (pendingAction === 'signup') {
      // Trigger sign up
      const signUpButton = document.querySelector('[data-clerk-sign-up]') as HTMLElement;
      if (signUpButton) signUpButton.click();
    }
    setPendingAction(null);
  };

  const handleTermsDecline = () => {
    setShowTerms(false);
    setPendingAction(null);
  };

  const handleSignIn = (e: React.MouseEvent) => {
    if (!hasAcceptedTerms) {
      e.preventDefault();
      setPendingAction('signin');
      setShowTerms(true);
    }
  };

  const handleSignUp = (e: React.MouseEvent) => {
    if (!hasAcceptedTerms) {
      e.preventDefault();
      setPendingAction('signup');
      setShowTerms(true);
    }
  };
  
  return (
    <>
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <a href="/" className="flex items-center gap-4 hover:opacity-90 transition">
              <div className="relative w-16 h-16">
                <img
                  src="/dapc-logo2.jpg"
                  alt="DAPC Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DAPC
                </h1>
                <p className="text-sm text-gray-500">Visibility Tracker</p>
              </div>
            </a>

            {/* Navigation and Sign In */}
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">
                  Pricing
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition">
                  About
                </a>
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
                    <button 
                      onClick={handleSignIn}
                      className="px-5 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button 
                      onClick={handleSignUp}
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-sm"
                    >
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={showTerms}
        onAccept={handleTermsAccept}
        onClose={handleTermsDecline}
      />
    </>
  );
}

// Search Section Component
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

// Hero Section - UPDATED with bolder text, blue and black colors, and italics - NO STATS
function HeroSection({ query, setQuery, loading, onSearch }: { 
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  onSearch: () => void;
}) {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        <span className="text-sm text-blue-700 font-medium">AI-Powered Analysis</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black mb-6 italic">
        <span className="text-black">Are You Visible</span>
        <br />
        <span className="text-blue-600">Online?</span>
      </h1>
      
      <SearchSection 
        query={query}
        setQuery={setQuery}
        loading={loading}
        onSearch={onSearch}
      />
    </div>
  );
}

// Features Section - WITH IMAGE ICONS
function FeaturesSection() {
  const features = [
    {
      icon: "/powerful features/seo-analysis.jpg",
      title: "SEO Analysis",
      description: "Comprehensive SEO score with actionable recommendations"
    },
    {
      icon: "/powerful features/googlemaps-check.jpg",
      title: "Google Maps Check",
      description: "Verify your business presence on Google Maps"
    },
    {
      icon: "/powerful features/socialmedia-audit.jpg",
      title: "Social Media Audit",
      description: "Track your brand across Facebook, X, Instagram & TikTok"
    },
    {
      icon: "/powerful features/competitor-tracking.jpg",
      title: "Competitor Tracking",
      description: "Compare your visibility against market competitors"
    },
    {
      icon: "/powerful features/realtime-reports.jpg",
      title: "Real-Time Reports",
      description: "Get instant insights with detailed analytics"
    },
    {
      icon: "/powerful features/growth-recommendations.jpg",
      title: "Growth Recommendations",
      description: "Actionable steps to improve your visibility score"
    }
  ];

  // Component to handle image loading errors
  const FeatureIcon = ({ src, alt }: { src: string; alt: string }) => {
    const [imgError, setImgError] = useState(false);
    
    if (imgError) {
      // Fallback emoji if image doesn't exist
      const fallbackIcons: { [key: string]: string } = {
        "SEO Analysis": "🔍",
        "Google Maps Check": "📍",
        "Social Media Audit": "📱",
        "Competitor Tracking": "🏆",
        "Real-Time Reports": "📊",
        "Growth Recommendations": "🚀"
      };
      return (
        <div className="text-4xl mb-4 group-hover:scale-110 transition">
          {fallbackIcons[alt] || "✨"}
        </div>
      );
    }
    
    return (
      <img
        src={src}
        alt={alt}
        className="w-16 h-16 mx-auto mb-4 object-contain group-hover:scale-110 transition"
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <div id="features" className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
      <p className="text-gray-600 text-center mb-12">Everything you need to dominate your market</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition hover:border-blue-200 group text-center">
            <FeatureIcon src={feature.icon} alt={feature.title} />
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
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
        <HeroSection 
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
        
        {/* Footer - UPDATED */}
        <footer id="about" className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; 2026 DAPC Visibility Tracker. All rights reserved.</p>
          <p className="mt-2">Empowering Kenyan businesses with data-driven insights</p>
          <p className="mt-1 text-xs text-gray-400">DAPC Visibility Tracker is a subsidiary of Lumee Entertainment</p>
        </footer>
      </main>
    </>
  );
}