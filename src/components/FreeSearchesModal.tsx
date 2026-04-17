// src/components/FreeSearchesModal.tsx
"use client";

import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

interface FreeSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingSearches: number;
}

export default function FreeSearchesModal({ isOpen, onClose, remainingSearches }: FreeSearchesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Free Searches Exhausted</h2>
          <p className="text-gray-600 mb-4">
            You've used all 5 free searches. Sign up or subscribe to continue auditing businesses!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Remaining free searches:</p>
            <p className="text-3xl font-bold text-orange-600">{remainingSearches}</p>
            <p className="text-xs text-gray-400 mt-1">5 searches per user (lifetime)</p>
          </div>
        </div>

        <div className="space-y-3">
          <SignUpButton mode="modal">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition">
              Sign Up for Free
            </button>
          </SignUpButton>
          
          <Link href="/#pricing" onClick={onClose}>
            <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              View Subscription Plans
            </button>
          </Link>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}