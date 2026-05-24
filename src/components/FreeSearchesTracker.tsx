// src/components/FreeSearchesTracker.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

// Maximum free searches allowed
const MAX_FREE_SEARCHES = 5;

// Storage keys
const FREE_SEARCHES_KEY = 'dapc_free_searches_remaining';
const SUBSCRIPTION_KEY = 'userSubscription';

interface FreeSearchesState {
  remainingSearches: number;
  totalUsed: number;
}

interface Subscription {
  status: 'active' | 'expired' | 'cancelled';
  endDate?: string;
}

export function useFreeSearches() {
  const { isSignedIn } = useAuth();
  const [freeSearches, setFreeSearches] = useState<FreeSearchesState>({
    remainingSearches: MAX_FREE_SEARCHES,
    totalUsed: 0,
  });
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load free searches count from localStorage
  const loadFreeSearches = () => {
    if (typeof window === 'undefined') return { remaining: MAX_FREE_SEARCHES, used: 0 };
    
    const saved = localStorage.getItem(FREE_SEARCHES_KEY);
    if (saved) {
      const remaining = parseInt(saved, 10);
      const used = MAX_FREE_SEARCHES - remaining;
      return { remaining: isNaN(remaining) ? MAX_FREE_SEARCHES : remaining, used };
    }
    return { remaining: MAX_FREE_SEARCHES, used: 0 };
  };

  // Load subscription status from localStorage (or later from API)
  const loadSubscription = (): boolean => {
    if (typeof window === 'undefined') return false;
    const subJson = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!subJson) return false;
    try {
      const sub: Subscription = JSON.parse(subJson);
      if (sub.status === 'active') {
        // Check if expired
        if (sub.endDate && new Date(sub.endDate) < new Date()) {
          localStorage.removeItem(SUBSCRIPTION_KEY);
          return false;
        }
        return true;
      }
    } catch (e) {
      console.error('Error parsing subscription', e);
    }
    return false;
  };

  useEffect(() => {
    const { remaining } = loadFreeSearches();
    const used = MAX_FREE_SEARCHES - remaining;
    setFreeSearches({ remainingSearches: remaining, totalUsed: used });
    setHasSubscription(loadSubscription());
    setIsLoading(false);
  }, []);

  // Save free searches count to localStorage
  const saveFreeSearches = (remaining: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FREE_SEARCHES_KEY, remaining.toString());
  };

  // Use one free search (decrement counter)
  const useFreeSearch = () => {
    if (hasSubscription) return true; // Unlimited, no decrement
    
    const currentRemaining = freeSearches.remainingSearches;
    if (currentRemaining <= 0) return false;
    
    const newRemaining = currentRemaining - 1;
    const newUsed = MAX_FREE_SEARCHES - newRemaining;
    setFreeSearches({ remainingSearches: newRemaining, totalUsed: newUsed });
    saveFreeSearches(newRemaining);
    return true;
  };

  // Check if user can perform a search
  const canPerformSearch = (): boolean => {
    if (hasSubscription) return true;
    return freeSearches.remainingSearches > 0;
  };

  // Get remaining free searches (for display)
  const getRemainingFreeSearches = (): number => {
    if (hasSubscription) return Infinity;
    return freeSearches.remainingSearches;
  };

  // Reset free searches (e.g., after subscription expiry – optional)
  const resetFreeSearches = () => {
    setFreeSearches({ remainingSearches: MAX_FREE_SEARCHES, totalUsed: 0 });
    saveFreeSearches(MAX_FREE_SEARCHES);
  };

  return {
    freeSearches,
    hasSubscription,
    isLoading,
    useFreeSearch,
    canPerformSearch,
    getRemainingFreeSearches,
    resetFreeSearches,
  };
}