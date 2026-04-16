// src/components/Pricing.tsx
"use client";

import { useState, useEffect } from "react";

interface Plan {
  name: string;
  price: number | null;
  features: string[];
  icon: string;
  isCustomAmount?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter Listing",
    price: 1999,
    features: ["Local SEO Scan"],
    icon: "/icons/starter-cheetah.jpg",
  },
  {
    name: "Local Boost",
    price: 3999,
    features: ["Competitor Tracking"],
    icon: "/icons/boost-buffalo.jpg",
  },
  {
    name: "Growth Engine",
    price: 5999,
    features: ["Social Media Audit"],
    icon: "/icons/growthengine-rhino.jpg",
  },
  {
    name: "Market Leader",
    price: 7999,
    features: ["Market Intelligence"],
    icon: "/icons/marketleader-elephant.jpg",
  },
  {
    name: "Super Visibility",
    price: 10000,
    features: ["Full Visibility Suite"],
    icon: "/icons/superactivevisibility-lion.jpg",
  },
  {
    name: "Custom Corporate Package",
    price: null,
    features: [
      "Tailored Solutions", 
      "Enterprise Support", 
      "Custom Strategy", 
      "Priority Service",
      "Flexible Pricing"
    ],
    icon: "/icons/custom corporate package.jpg",
    isCustomAmount: true,
  },
];

// Component to safely render plan icons
function PlanIcon({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  
  if (imgError) {
    return (
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
        {alt.charAt(0)}
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

// Terms Agreement Modal Component
function TermsAgreementModal({ 
  isOpen, 
  onAccept, 
  onDecline 
}: { 
  isOpen: boolean; 
  onAccept: () => void; 
  onDecline: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAgreed(false);
      setScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    if (isBottom) {
      setScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onDecline} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center">Terms and Conditions</h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Please read and accept to continue with your subscription
          </p>
        </div>

        <div 
          className="flex-1 overflow-y-auto p-6 space-y-4"
          onScroll={handleScroll}
        >
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-600 mb-4">
              By accessing and using DAPC Visibility Tracker, you accept and agree to be bound by the terms 
              and conditions outlined in this agreement. If you do not agree to these terms, please do not 
              use our services.
            </p>

            <h3 className="text-lg font-semibold mb-3">2. Service Description</h3>
            <p className="text-gray-600 mb-4">
              DAPC Visibility Tracker provides digital visibility auditing services including but not limited to:
              SEO analysis, Google Maps presence verification, social media auditing, competitor tracking, 
              and market intelligence reports.
            </p>

            <h3 className="text-lg font-semibold mb-3">3. Payment Terms</h3>
            <p className="text-gray-600 mb-4">
              All payments are processed through M-Pesa. Subscription fees are charged in Kenya Shillings (KES).
              Custom corporate packages have flexible pricing determined by the customer at the time of payment.
              Refunds are issued at the discretion of DAPC Visibility Tracker.
            </p>

            <h3 className="text-lg font-semibold mb-3">4. User Obligations</h3>
            <p className="text-gray-600 mb-4">
              Users agree to provide accurate information when using our services. You are responsible for 
              maintaining the confidentiality of your account credentials. Any unauthorized use of your 
              account must be reported immediately.
            </p>

            <h3 className="text-lg font-semibold mb-3">5. Data Privacy</h3>
            <p className="text-gray-600 mb-4">
              We collect and process business visibility data to provide our services. Personal information 
              is handled in accordance with our Privacy Policy and Kenyan data protection laws (Data 
              Protection Act, 2019).
            </p>

            <h3 className="text-lg font-semibold mb-3">6. Intellectual Property</h3>
            <p className="text-gray-600 mb-4">
              All content, features, and functionality of DAPC Visibility Tracker are owned by Lumee Ent. Limited 
              and are protected by Kenyan and international copyright laws.
            </p>

            <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
            <p className="text-gray-600 mb-4">
              DAPC Visibility Tracker provides visibility scores based on available data. We do not guarantee 
              specific business outcomes or rankings. Our liability is limited to the amount paid for services 
              in the preceding 12 months.
            </p>

            <h3 className="text-lg font-semibold mb-3">8. Termination</h3>
            <p className="text-gray-600 mb-4">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in 
              fraudulent activities. Users may cancel their subscription at any time.
            </p>

            <h3 className="text-lg font-semibold mb-3">9. Governing Law</h3>
            <p className="text-gray-600 mb-4">
              These terms are governed by the laws of the Republic of Kenya. Any disputes shall be resolved 
              in Kenyan courts.
            </p>

            <h3 className="text-lg font-semibold mb-3">10. Contact Information</h3>
            <p className="text-gray-600 mb-4">
              For questions about these terms, contact us at: info@dapcvisibilitytracker.co.ke
            </p>

            <p className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-100">
              Last updated: January 2026
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the Terms and Conditions
            </span>
          </label>
          
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!agreed || !scrolledToBottom}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Accept & Continue
            </button>
          </div>
          {!scrolledToBottom && (
            <p className="text-xs text-gray-400 text-center">
              Please scroll to the bottom to read the complete terms
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Payment Modal Component
function PaymentModal({ 
  selected, 
  phone, 
  setPhone, 
  loading, 
  customAmount,
  setCustomAmount,
  sendSTK, 
  onClose 
}: { 
  selected: Plan | null;
  phone: string;
  setPhone: (phone: string) => void;
  loading: boolean;
  customAmount: string;
  setCustomAmount: (amount: string) => void;
  sendSTK: () => void;
  onClose: () => void;
}) {
  if (!selected) return null;
  
  const isCustomAmountPackage = selected.isCustomAmount === true;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl w-96 max-w-[90%] text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold mb-2 text-xl">{selected.name}</h2>
        
        {isCustomAmountPackage ? (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Enter your desired amount in KES</p>
            <p className="text-xs text-gray-500 mb-3">You will enter this amount at the M-Pesa prompt</p>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount e.g., 5000"
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-lg"
              disabled={loading}
              min="10"
              step="100"
            />
            {customAmount && parseInt(customAmount) > 0 && (
              <p className="text-sm text-green-600 mt-2 font-semibold">
                You will pay: KES {parseInt(customAmount).toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <p className="mb-4 text-2xl font-bold text-blue-600">KES {selected.price?.toLocaleString()}</p>
        )}
        
        <p className="text-sm text-gray-600 mb-2">Enter M-Pesa phone number</p>
        <p className="text-xs text-gray-400 mb-3">You will receive a prompt to enter your PIN</p>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0712345678"
          className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={loading}
        />
        
        <button
          onClick={sendSTK}
          disabled={loading || !phone.trim() || (isCustomAmountPackage && (!customAmount || parseInt(customAmount) < 10))}
          className="bg-green-600 text-white w-full py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Sending M-Pesa Prompt..." : isCustomAmountPackage && customAmount ? `Pay KES ${parseInt(customAmount).toLocaleString()}` : "Proceed to Payment"}
        </button>
        
        <button
          onClick={onClose}
          className="text-sm mt-4 text-gray-500 hover:text-gray-700 transition"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);

  // Check if user has already accepted terms
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasAcceptedTerms(localStorage.getItem('termsAccepted') === 'true');
    }
  }, []);

  const openModal = (plan: Plan) => {
    // Check if terms are accepted
    if (!hasAcceptedTerms) {
      setPendingPlan(plan);
      setShowTerms(true);
      return;
    }
    
    setSelected(plan);
    setCustomAmount("");
    setOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setShowTerms(false);
    
    // Open the payment modal for the pending plan
    if (pendingPlan) {
      setSelected(pendingPlan);
      setCustomAmount("");
      setOpen(true);
      document.body.style.overflow = 'hidden';
      setPendingPlan(null);
    }
  };

  const handleTermsDecline = () => {
    setShowTerms(false);
    setPendingPlan(null);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
    setPhone("");
    setCustomAmount("");
    document.body.style.overflow = 'auto';
  };

  // Reset free searches after subscription
  const resetFreeSearchesAfterSubscription = () => {
    // Clear free searches for signed-in user
    const userId = localStorage.getItem('clerk_user_id');
    if (userId) {
      const storageKey = `freeSearches_${userId}`;
      localStorage.removeItem(storageKey);
    }
    // Also clear anonymous
    localStorage.removeItem('freeSearches_anonymous');
  };

  // Save subscription to localStorage after successful payment
  const saveSubscription = (plan: Plan, amountPaid: number) => {
    const subscription = {
      packageName: plan.name,
      amount: amountPaid,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      features: plan.features,
      isCustomAmount: plan.isCustomAmount || false,
    };
    localStorage.setItem('userSubscription', JSON.stringify(subscription));
    
    // Reset free searches after subscription
    resetFreeSearchesAfterSubscription();
    
    console.log('Subscription saved:', subscription);
  };

  const sendSTK = async () => {
    if (!selected) {
      alert("No plan selected");
      return;
    }
    
    if (!phone.trim()) {
      alert("Please enter your M-Pesa phone number");
      return;
    }

    let amountToCharge: number;
    
    if (selected.isCustomAmount) {
      if (!customAmount || parseInt(customAmount) < 10) {
        alert("Please enter a valid amount (minimum KES 10)");
        return;
      }
      amountToCharge = parseInt(customAmount);
    } else {
      amountToCharge = selected.price!;
    }

    let formatted = phone.trim().replace(/\s/g, '');
    
    if (formatted.startsWith("+254")) {
      formatted = formatted.substring(1);
    } else if (formatted.startsWith("0")) {
      formatted = "254" + formatted.substring(1);
    } else if (formatted.startsWith("254")) {
      // Already in correct format
    } else if (formatted.length === 9) {
      formatted = "254" + formatted;
    } else {
      alert("Please enter a valid Kenyan phone number (e.g., 0712345678)");
      return;
    }
    
    if (!formatted.match(/^254[17]\d{8}$/)) {
      alert("Please enter a valid Safaricom phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formatted,
          amount: amountToCharge,
          planName: selected.name,
          isCustomAmount: selected.isCustomAmount || false,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "STK push failed. Please try again.");
      }

      saveSubscription(selected, amountToCharge);
      
      alert(`✅ Payment request sent to ${formatted}\nEnter your M-Pesa PIN to complete payment`);
      closeModal();
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(`❌ Payment error: ${err.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Visibility Plans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-xl p-5 text-center shadow-sm hover:shadow-md transition bg-white"
          >
            <PlanIcon src={plan.icon} alt={plan.name} />
            
            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
            
            <p className="text-blue-600 font-bold text-xl mb-3">
              {plan.price === null ? (
                <span className="text-base">Pay What You Want</span>
              ) : (
                `KES ${plan.price.toLocaleString()}`
              )}
            </p>
            
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              {plan.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
            
            <button
              onClick={() => openModal(plan)}
              className="mt-2 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {plan.isCustomAmount ? "Pay Custom Amount" : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>
      
      {/* Terms Agreement Modal */}
      <TermsAgreementModal 
        isOpen={showTerms}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
      
      {/* Payment Modal */}
      {open && (
        <PaymentModal
          selected={selected}
          phone={phone}
          setPhone={setPhone}
          loading={loading}
          customAmount={customAmount}
          setCustomAmount={setCustomAmount}
          sendSTK={sendSTK}
          onClose={closeModal}
        />
      )}
    </div>
  );
}