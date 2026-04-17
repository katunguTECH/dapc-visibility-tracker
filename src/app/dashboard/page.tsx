// src/app/dashboard/page.tsx
"use client";

import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Subscription {
  packageName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  features: string[];
  isCustomAmount?: boolean;
}

// Admin emails - only these users can see the Reports link
const ADMIN_EMAILS = [
  'info@dapc.co.ke',
  'katungu1@gmail.com',
  'n.waswani@dapc.co.ke',
  'h.munyoki@dapc.co.ke',
  'k.ouko@dapc.co.ke'
];

// Plan details based on the pricing structure
const planDetails: Record<string, {
  description: string;
  targetAudience: string;
  keyBenefits: string[];
  color: string;
  gradient: string;
}> = {
  "Starter Listing": {
    description: "For small or offline businesses. We make sure your business is properly set up and visible online.",
    targetAudience: "Small businesses starting their online presence",
    keyBenefits: [
      "Business information cleanup",
      "Improved local presence",
      "Visibility Score tracking",
      "Customer findability in local searches"
    ],
    color: "blue",
    gradient: "from-blue-500 to-blue-600"
  },
  "Local Boost": {
    description: "Actively improves how your business appears in local searches and Google Maps.",
    targetAudience: "Businesses wanting more walk-ins & calls",
    keyBenefits: [
      "Google Maps optimization",
      "Targeted search terms",
      "Track calls and directions",
      "Increase real customer actions"
    ],
    color: "green",
    gradient: "from-green-500 to-green-600"
  },
  "Growth Engine": {
    description: "Actively improve your website visibility and track real leads month by month.",
    targetAudience: "Businesses ready for consistent monthly leads",
    keyBenefits: [
      "Website visibility improvement",
      "Multiple keyword targeting",
      "Track calls & WhatsApp inquiries",
      "Monthly progress tracking",
      "Predictable business inquiries"
    ],
    color: "purple",
    gradient: "from-purple-500 to-purple-600"
  },
  "Market Leader": {
    description: "Position your business ahead of competitors in competitive industries.",
    targetAudience: "Businesses in competitive industries",
    keyBenefits: [
      "Strengthened rankings",
      "AI-driven search platform optimization",
      "Competitor comparisons",
      "Advanced performance tracking",
      "Stand out as top choice"
    ],
    color: "orange",
    gradient: "from-orange-500 to-red-600"
  },
  "Super Visibility": {
    description: "Maximum exposure for ambitious brands locally, nationally, and internationally.",
    targetAudience: "Ambitious brands seeking maximum exposure",
    keyBenefits: [
      "Maximum online exposure",
      "Local & international presence",
      "AI platform recognition",
      "Priority optimization",
      "Monthly performance insights",
      "Lead tracking and growth metrics"
    ],
    color: "red",
    gradient: "from-red-500 to-pink-600"
  },
  "Custom Corporate Package": {
    description: "Tailored solutions for enterprise-level businesses with specific needs.",
    targetAudience: "Large enterprises and corporations",
    keyBenefits: [
      "Tailored Solutions",
      "Enterprise Support",
      "Custom Strategy",
      "Priority Service",
      "Flexible Pricing"
    ],
    color: "indigo",
    gradient: "from-indigo-500 to-purple-600"
  }
};

// Helper function to get initials for avatar
const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export default function DashboardPage() {
  const { isSignedIn, userId, user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    // Get user name from Clerk
    if (user?.fullName) {
      setUserName(user.fullName);
    } else if (user?.firstName) {
      setUserName(`${user.firstName} ${user.lastName || ''}`);
    } else {
      setUserName("Valued Customer");
    }

    // Check if user is admin
    if (user?.primaryEmailAddress?.emailAddress) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      setIsAdmin(ADMIN_EMAILS.includes(userEmail));
    }

    // Load subscription from localStorage
    const loadSubscription = async () => {
      try {
        const savedSubscription = localStorage.getItem('userSubscription');
        
        if (savedSubscription) {
          const parsed = JSON.parse(savedSubscription);
          setSubscription(parsed);
        } else {
          // Check URL params for just subscribed plan
          const urlParams = new URLSearchParams(window.location.search);
          const justSubscribed = urlParams.get('subscribed');
          const planName = urlParams.get('plan');
          
          if (justSubscribed === 'true' && planName) {
            // Find the plan from pricing
            const plans: Record<string, { amount: number; features: string[] }> = {
              "Starter Listing": { amount: 1999, features: ["Local SEO Scan", "Business information cleanup", "Improved local presence", "Visibility Score tracking"] },
              "Local Boost": { amount: 3999, features: ["Competitor Tracking", "Google Maps optimization", "Targeted search terms", "Track calls and directions"] },
              "Growth Engine": { amount: 5999, features: ["Social Media Audit", "Website visibility improvement", "Multiple keyword targeting", "Track calls & WhatsApp inquiries", "Monthly progress tracking"] },
              "Market Leader": { amount: 7999, features: ["Market Intelligence", "Strengthened rankings", "AI-driven search platform optimization", "Competitor comparisons", "Advanced performance tracking"] },
              "Super Visibility": { amount: 10000, features: ["Full Visibility Suite", "Maximum online exposure", "Local & international presence", "AI platform recognition", "Priority optimization", "Monthly performance insights"] }
            };
            
            const planInfo = plans[planName] || { amount: 0, features: [] };
            const newSubscription = {
              packageName: planName,
              amount: planInfo.amount,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'active' as const,
              features: planInfo.features,
            };
            setSubscription(newSubscription);
            localStorage.setItem('userSubscription', JSON.stringify(newSubscription));
          }
        }
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [isSignedIn, router, user]);

  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const planDetail = subscription ? planDetails[subscription.packageName] : planDetails["Starter Listing"];
  const daysRemaining = subscription ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/dapc-logo2.jpg"
                alt="DAPC Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DAPC
                </h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              {/* Show Reports link only for admin users */}
              {isAdmin && (
                <Link href="/admin/reports" className="text-gray-600 hover:text-blue-600 transition font-medium">
                  Reports
                </Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your visibility tracking subscription</p>
        </div>

        {/* Active Plan Banner */}
        {subscription && subscription.status === 'active' && (
          <div className={`bg-gradient-to-r ${planDetail.gradient} rounded-2xl p-6 mb-8 text-white`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm opacity-90">Active Plan</p>
                <h2 className="text-2xl font-bold">{subscription.packageName}</h2>
                <p className="text-sm opacity-90 mt-1">KES {subscription.amount.toLocaleString()}/month</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Days Remaining</p>
                <p className="text-3xl font-bold">{daysRemaining}</p>
                <p className="text-xs opacity-75">Renews on {new Date(subscription.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Details Card */}
        {subscription && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Plan Overview</h2>
              <p className="text-gray-600 text-sm mt-1">{planDetail.description}</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Target Audience */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Target Audience
                  </h3>
                  <p className="text-gray-700">{planDetail.targetAudience}</p>
                </div>

                {/* Monthly Investment */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Monthly Investment
                  </h3>
                  <p className="text-gray-700">
                    <span className="text-2xl font-bold text-blue-600">KES {subscription.amount.toLocaleString()}</span>
                    <span className="text-gray-500"> per month</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Benefits Section */}
        {subscription && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">What's Included</h2>
              <p className="text-gray-600 text-sm mt-1">Key benefits and features of your {subscription.packageName} plan</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {planDetail.keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/" className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Run New Audit</h3>
              <p className="text-sm text-gray-600">Check your current visibility score</p>
              <span className="inline-block mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Run Audit →
              </span>
            </div>
          </Link>

          <Link href="/dashboard/reports" className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Reports</h3>
              <p className="text-sm text-gray-600">Access detailed visibility reports and audit history</p>
              <span className="inline-block mt-3 text-purple-600 text-sm font-medium group-hover:text-purple-700">
                View All Reports →
              </span>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-sm text-gray-600">Get help with your subscription</p>
            <button className="inline-block mt-3 text-green-600 text-sm font-medium hover:text-green-700">
              Contact Support →
            </button>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Your recent visibility checks and account activity</p>
          </div>
          <div className="p-6 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No recent activity to display</p>
            <p className="text-sm mt-1">Run your first visibility audit to get started</p>
            <Link href="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Run Audit Now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}