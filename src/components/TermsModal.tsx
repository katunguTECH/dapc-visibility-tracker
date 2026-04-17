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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-center">Terms and Conditions</h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            DRIVE AFRICA PERFORMANCE CENTRE (DAPC)
          </p>
          <p className="text-xs text-gray-400 text-center">
            Effective Date: 01 March 2026
          </p>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-6"
          onScroll={handleScroll}
        >
          <div className="prose prose-sm max-w-none">
            {/* Acceptance Section */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">1. ACCEPTANCE OF TERMS</h3>
              <p className="text-blue-800">
                By using DAPC services, you confirm that:
              </p>
              <ul className="list-disc pl-5 mt-2 text-blue-800">
                <li>You have read and understood these Terms</li>
                <li>You agree to be bound by them</li>
                <li>You are authorized to act on behalf of your business (if applicable)</li>
              </ul>
            </div>

            {/* Nature of Services */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. NATURE OF SERVICES</h3>
              <p className="text-gray-700 mb-2">DAPC provides:</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Digital visibility services (SEO & GEO)</li>
                <li>Business listing and optimization</li>
                <li>Analytics and performance tracking</li>
                <li>Marketing exposure tools</li>
              </ul>
              <p className="text-gray-700 mt-2">
                DAPC does <strong>not guarantee specific sales, revenue, or ranking positions</strong>, 
                but provides tools and strategies to improve visibility.
              </p>
            </div>

            {/* No Guarantee of Results */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. NO GUARANTEE OF RESULTS</h3>
              <p className="text-gray-700 mb-2">The Client acknowledges:</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Digital marketing outcomes vary based on market conditions</li>
                <li>Search engine rankings are influenced by third parties</li>
                <li>Customer conversion is not controlled by DAPC</li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>DAPC does not guarantee:</strong>
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Specific revenue increases</li>
                <li>Guaranteed leads or customers</li>
                <li>First-page ranking on search engines</li>
              </ul>
            </div>

            {/* Independent Sales Agents Disclaimer */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. INDEPENDENT SALES AGENTS DISCLAIMER</h3>
              <p className="text-gray-700">
                DAPC may use <strong>independent sales agents</strong>. The Client agrees that sales agents are 
                <strong>not authorized to alter official terms or pricing</strong>. Any promises made outside 
                official DAPC documentation are <strong>not binding</strong>.
              </p>
              <p className="text-gray-700 mt-2">
                DAPC shall <strong>not be liable</strong> for misrepresentation by rogue agents, unauthorized 
                promises, or verbal agreements not reflected in official documentation.
              </p>
            </div>

            {/* Client Responsibilities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. CLIENT RESPONSIBILITIES</h3>
              <p className="text-gray-700 mb-2">The Client agrees to:</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Provide accurate business information</li>
                <li>Cooperate in onboarding and setup</li>
                <li>Maintain ethical business practices</li>
                <li>Not misuse the platform</li>
              </ul>
              <p className="text-gray-700 mt-2">
                DAPC is not responsible for poor results caused by incorrect client data, lack of client 
                cooperation, or external business factors.
              </p>
            </div>

            {/* Payment Terms */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. PAYMENT TERMS</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Services are provided on a <strong>subscription basis</strong></li>
                <li>Payments must be made in full and on time</li>
                <li>Failure to pay may result in suspension of services</li>
                <li>All payments are <strong>non-refundable</strong>, except where required by law</li>
              </ul>
            </div>

            {/* Service Delivery */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7. SERVICE DELIVERY</h3>
              <p className="text-gray-700">
                DAPC will provide services within reasonable timelines and use best efforts to improve visibility. 
                However, timelines may vary due to platform changes, technical factors, or third-party dependencies.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">8. LIMITATION OF LIABILITY</h3>
              <p className="text-red-800">
                To the fullest extent permitted by law, DAPC shall <strong>not be liable</strong> for:
              </p>
              <ul className="list-disc pl-5 mt-2 text-red-800">
                <li>Loss of business or revenue</li>
                <li>Indirect or consequential damages</li>
                <li>Loss arising from reliance on search engine results</li>
                <li>Actions of third-party platforms (e.g., Google)</li>
              </ul>
              <p className="text-red-800 font-semibold mt-3">
                Total liability shall not exceed: The amount paid by the client in the last 30 days with a 
                minimum subscription of 12 months.
              </p>
            </div>

            {/* Indemnity */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">9. INDEMNITY</h3>
              <p className="text-gray-700">
                The Client agrees to indemnify and hold harmless DAPC against claims arising from misuse of the 
                platform, false or misleading business information, legal disputes related to the Client's 
                business, or any breach of these Terms.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">10. INTELLECTUAL PROPERTY</h3>
              <p className="text-gray-700">
                All DAPC materials including software, branding, and content remain the property of DAPC. 
                Clients may not copy, resell, or redistribute without written consent.
              </p>
            </div>

            {/* Data & Privacy */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">11. DATA & PRIVACY</h3>
              <p className="text-gray-700">
                DAPC may collect and use data to improve services, provide analytics, and enhance user experience. 
                DAPC will take reasonable steps to protect client data but does not guarantee absolute security.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">12. TERMINATION</h3>
              <p className="text-gray-700">
                DAPC may suspend or terminate services if terms are breached, payments are not made, or fraudulent 
                activity is detected. Clients may terminate by giving notice, subject to payment obligations.
              </p>
            </div>

            {/* Breach of Contract */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">13. BREACH OF CONTRACT</h3>
              <p className="text-gray-700">
                If the Client breaches these Terms, access may be suspended, legal action may be taken, and no 
                refunds shall be issued.
              </p>
            </div>

            {/* Force Majeure */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">14. FORCE MAJEURE</h3>
              <p className="text-gray-700">
                DAPC shall not be liable for failure to perform due to natural disasters, internet outages, 
                government actions, or events beyond reasonable control.
              </p>
            </div>

            {/* Amendments */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">15. AMENDMENTS</h3>
              <p className="text-gray-700">
                DAPC reserves the right to update these Terms at any time. Continued use of services implies 
                acceptance of updated Terms.
              </p>
            </div>

            {/* Governing Law */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">16. GOVERNING LAW</h3>
              <p className="text-gray-700">
                These Terms shall be governed by the laws of <strong>Kenya</strong>. Any disputes shall be 
                resolved in <strong>Nairobi</strong>.
              </p>
            </div>

            {/* Entire Agreement */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">17. ENTIRE AGREEMENT</h3>
              <p className="text-gray-700">
                These Terms constitute the entire agreement between DAPC and the Client.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">18. CONTACT INFORMATION</h3>
              <p className="text-gray-700">
                <strong>Drive Africa Performance Centre (DAPC)</strong><br />
                Email: info@dapc.co.ke<br />
                Phone: +254719584440
              </p>
            </div>

            {/* Privacy Policy Section */}
            <div className="border-t-2 border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">PRIVACY POLICY</h2>
              <p className="text-sm text-gray-500 mb-4">Effective Date: 01 March 2026</p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. INTRODUCTION</h3>
              <p className="text-gray-700 mb-4">
                Drive Africa Performance Centre (DAPC) is committed to protecting your personal and business data. 
                This Privacy Policy explains how we collect, use, and protect your information.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. DATA WE COLLECT</h3>
              <p className="text-gray-700 mb-2">We may collect:</p>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                <li><strong>Personal Information:</strong> Name, phone number, email address</li>
                <li><strong>Business Information:</strong> Business name, location, services/products offered</li>
                <li><strong>Technical Data:</strong> IP address, device type, browser data, app usage data</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. HOW WE USE YOUR DATA</h3>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                <li>Provide and improve our services</li>
                <li>Set up and manage your account</li>
                <li>Analyze business visibility performance</li>
                <li>Communicate updates and support</li>
                <li>Improve marketing and user experience</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. LEGAL BASIS (GDPR PRINCIPLES)</h3>
              <p className="text-gray-700 mb-4">
                We process your data based on: <strong>Consent</strong> (when you sign up), 
                <strong>Contract</strong> (to deliver services), and <strong>Legitimate interest</strong> 
                (improving our platform).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. DATA SHARING</h3>
              <p className="text-gray-700 mb-4">
                We do <strong>not sell your data</strong>. We may share data with service providers, legal 
                authorities (if required by law), or business partners (only where necessary for service delivery).
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. DATA SECURITY</h3>
              <p className="text-gray-700 mb-4">
                We implement reasonable measures including secure servers, restricted access, and encryption where 
                applicable. However, no system is 100% secure.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">7. DATA RETENTION</h3>
              <p className="text-gray-700 mb-4">
                We retain your data as long as your account is active, as required by law, or for legitimate 
                business purposes.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">8. YOUR RIGHTS</h3>
              <p className="text-gray-700 mb-4">
                You have the right to access your data, request correction, request deletion, withdraw consent, 
                or object to processing. Requests can be made via our contact details.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">9. COOKIES</h3>
              <p className="text-gray-700 mb-4">
                We may use cookies to improve user experience, analyze traffic, and personalize content. You can 
                disable cookies in your browser settings.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">10. THIRD-PARTY LINKS</h3>
              <p className="text-gray-700 mb-4">
                Our platform may link to third-party services. We are not responsible for their privacy practices.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">11. CHANGES TO POLICY</h3>
              <p className="text-gray-700 mb-4">
                We may update this policy at any time. Continued use of our services indicates acceptance.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">12. GOVERNING LAW</h3>
              <p className="text-gray-700 mb-4">
                This policy is governed by the laws of <strong>Kenya</strong>.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">13. CONTACT</h3>
                <p className="text-gray-700">
                  <strong>Drive Africa Performance Centre (DAPC)</strong><br />
                  Email: info@dapc.co.ke<br />
                  Phone: +254719584440
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 space-y-4 sticky bottom-0 bg-white rounded-b-2xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the Terms and Conditions and Privacy Policy
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