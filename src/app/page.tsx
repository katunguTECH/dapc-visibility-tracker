// src/app/page.tsx
"use client";

import { useState, Suspense, useEffect } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import VisibilityCard from "@/components/VisibilityCard";
import Pricing from "@/components/Pricing";
import TermsModal from "@/components/TermsModal";
import { useFreeSearches } from "@/components/FreeSearchesTracker";
import FreeSearchesModal from "@/components/FreeSearchesModal";
import { hasCompletedFirstAudit, markFirstAuditCompleted } from "@/utils/audit-storage";

// Admin emails - only these users can see the Reports link
const ADMIN_EMAILS = [
  'info@dapc.co.ke',
  'katungu1@gmail.com',
  'n.waswani@dapc.co.ke',
  'h.munyoki@dapc.co.ke',
  'k.ouko@dapc.co.ke'
];

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

// No data state (now shown only for authenticated users)
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
  const { isSignedIn, user } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [pendingAction, setPendingAction] = useState<'signin' | 'signup' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Store terms acceptance in localStorage
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      setIsAdmin(ADMIN_EMAILS.includes(userEmail));
    } else {
      setIsAdmin(false);
    }
  }, [isSignedIn, user]);
  
  // Check localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasAcceptedTerms(localStorage.getItem('termsAccepted') === 'true');
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setShowTerms(false);
    if (pendingAction === 'signin') {
      const signInButton = document.querySelector('[data-clerk-sign-in]') as HTMLElement;
      if (signInButton) signInButton.click();
    } else if (pendingAction === 'signup') {
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
              
              {/* Admin Reports Link - Visible to everyone */}
              <a 
                href="/admin-reports" 
                className="text-gray-600 hover:text-blue-600 transition font-medium"
              >
                Admin Reports
              </a>
              
              {isSignedIn ? (
                <>
                  <a href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                    Dashboard
                  </a>
                  {/* Show Reports link only for admin users */}
                  {isAdmin && (
                    <a href="/admin/reports" className="text-gray-600 hover:text-blue-600 transition font-medium">
                      Reports
                    </a>
                  )}
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
  onSearch,
  isSignedIn
}: { 
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  onSearch: () => void;
  isSignedIn: boolean;
}) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && isSignedIn) {
      onSearch();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border p-8 mb-12">
      <h2 className="text-2xl font-bold mb-2 text-center">Run Your Visibility Audit</h2>
      <p className="text-gray-600 text-center mb-6">Enter any business name to get started</p>
      
      {!isSignedIn ? (
        <div className="text-center">
          <p className="text-red-600 mb-4">🔒 Please sign in to run a visibility audit</p>
          <SignUpButton mode="modal">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
              Sign Up for Free
            </button>
          </SignUpButton>
        </div>
      ) : (
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
      )}
      
      <p className="text-xs text-gray-400 text-center mt-4">
        {isSignedIn ? "Free audit • Subscription unlocks unlimited searches" : "Sign in to start your free visibility audit"}
      </p>
    </div>
  );
}

// Hero Section
function HeroSection({ 
  query, 
  setQuery, 
  loading, 
  onSearch,
  isSignedIn
}: { 
  query: string;
  setQuery: (q: string) => void;
  loading: boolean;
  onSearch: () => void;
  isSignedIn: boolean;
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
        isSignedIn={isSignedIn}
      />
    </div>
  );
}

// Features Section
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

  const FeatureIcon = ({ src, alt }: { src: string; alt: string }) => {
    const [imgError, setImgError] = useState(false);
    
    if (imgError) {
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
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFreeSearchesModal, setShowFreeSearchesModal] = useState(false);
  const [userJustSignedUp, setUserJustSignedUp] = useState(false);
  
  const { 
    canPerformSearch, 
    useFreeSearch, 
    getRemainingFreeSearches,
    hasSubscription,
    freeSearches 
  } = useFreeSearches();

  // Handle post-signup redirect
  useEffect(() => {
    const justSignedUp = localStorage.getItem('dapc_just_signed_up') === 'true';
    if (justSignedUp && isSignedIn) {
      setUserJustSignedUp(true);
      localStorage.removeItem('dapc_just_signed_up');
    }
  }, [isSignedIn]);

  // Save audit to localStorage (backup) and to Clerk metadata if signed in
  const saveAuditToHistory = (businessName: string, score: number, seoScore: number, mapsPresence: boolean, social: any) => {
    const history = JSON.parse(localStorage.getItem('dapc_audit_history') || '[]');
    const newAudit = {
      id: Date.now().toString(),
      businessName: businessName,
      score: score,
      seoScore: seoScore,
      mapsPresence: mapsPresence,
      social: social,
      date: new Date().toISOString().split('T')[0],
    };
    history.unshift(newAudit);
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem('dapc_audit_history', JSON.stringify(trimmedHistory));
  };

  const runAudit = async () => {
    setError(null);
    setData(null);

    if (!query.trim()) {
      setError("Please enter a business name");
      return;
    }

    // NEW: If user just signed up after their first free audit, allow them to continue
    if (userJustSignedUp) {
      setUserJustSignedUp(false);
      // Allow the audit to proceed without further checks
    }
    // If not signed in at all, redirect to sign up
    else if (!isSignedIn) {
      // Store the current query and results in session storage to restore after signup
      sessionStorage.setItem('pendingAuditQuery', query);
      sessionStorage.setItem('pendingAuditResults', JSON.stringify(data));
      // Set flag to indicate user is signing up after first audit
      localStorage.setItem('dapc_just_signed_up', 'true');
      router.push('/sign-up');
      return;
    }

    // Check free search limit (only applies to non-subscribers)
    if (!canPerformSearch()) {
      setShowFreeSearchesModal(true);
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
      
      // Save to local history
      saveAuditToHistory(
        validatedData.business,
        validatedData.score,
        validatedData.seoScore,
        validatedData.mapsPresence,
        validatedData.social
      );
      
      // Mark first audit as completed if this is the user's first time
      if (!hasCompletedFirstAudit()) {
        markFirstAuditCompleted();
      }
      
      // Consume one free search (if not subscribed)
      useFreeSearch();

      // If user is signed in, save visibility profile to Clerk metadata
      if (isSignedIn && user) {
        try {
          await fetch('/api/user/update-visibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              business: validatedData.business,
              score: validatedData.score,
              seoScore: validatedData.seoScore,
              mapsPresence: validatedData.mapsPresence,
              social: validatedData.social,
            }),
          });
          console.log("Profile saved to Clerk metadata");
        } catch (err) {
          console.error("Failed to save profile:", err);
        }
      }
      
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
          isSignedIn={!!isSignedIn}
        />
        
        {/* Show remaining free searches for non-subscribers (only if signed in) */}
        {isSignedIn && !hasSubscription && freeSearches.remainingSearches > 0 && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-orange-700">
                Free searches remaining: <strong>{freeSearches.remainingSearches}</strong> of 5
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Lifetime free searches • Sign up for more features
            </p>
          </div>
        )}
        
        {/* Show unlimited for subscribers */}
        {isSignedIn && hasSubscription && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-green-700">
                Unlimited searches • Active Subscription
              </span>
            </div>
          </div>
        )}
        
        {error && <ErrorDisplay message={error} />}
        
        {loading && <LoadingState />}
        
        <div className="mt-6">
          <Suspense fallback={<LoadingState />}>
            {!loading && !error && data && <VisibilityCard {...data} />}
            {!loading && !error && !data && isSignedIn && <NoDataState />}
            {!loading && !error && !data && !isSignedIn && (
              <div className="mt-6 p-8 bg-gray-50 rounded-2xl text-center border border-gray-200">
                <p className="text-gray-600">
                  Sign in above to run your first visibility audit.
                </p>
              </div>
            )}
          </Suspense>
        </div>
        
        <FeaturesSection />
        
        <div id="pricing" className="mt-12">
          <Pricing />
        </div>
        
        {/* Footer with WhatsApp and email contact */}
        <footer id="about" className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; 2026 DAPC Visibility Tracker. All rights reserved.</p>
          <p className="mt-2">Empowering Kenyan businesses with data-driven insights</p>
          <p className="mt-1 text-xs text-gray-400">DAPC Visibility Tracker is a subsidiary of Lumee Ent. Limited</p>
          
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <a 
                href="https://wa.me/254722973020?text=Hello!%20I%20need%20assistance%20with%20the%20DAPC%20Visibility%20Tracker.%20Can%20you%20help%20me%3F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors font-medium"
              >
                Chat with us on WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a 
                href="mailto:info@dapc.co.ke" 
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                info@dapc.co.ke
              </a>
            </div>
          </div>
        </footer>
      </main>

      <FreeSearchesModal 
        isOpen={showFreeSearchesModal}
        onClose={() => setShowFreeSearchesModal(false)}
        remainingSearches={getRemainingFreeSearches()}
      />
    </>
  );
}