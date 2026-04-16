// src/components/TermsModal.tsx
"use client";

import { useState, useEffect } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onAccept, onClose }: TermsModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center">Terms and Conditions</h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Please read and accept to continue
          </p>
        </div>

        {/* Content */}
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
              All content, features, and functionality of DAPC Visibility Tracker are owned by Lumee Entertainment 
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

        {/* Footer */}
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
              onClick={onClose}
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