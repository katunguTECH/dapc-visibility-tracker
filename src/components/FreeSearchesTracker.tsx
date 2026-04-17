// src/components/FreeSearchesTracker.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface FreeSearchesData {
  remainingSearches: number;
  totalSearchesUsed: number;
  hasUsedFreeSearches: boolean;
}

const MAX_FREE_SEARCHES = 5;

export function useFreeSearches() {
  const { isSignedIn, userId } = useAuth();
  const [freeSearches, setFreeSearches] = useState<FreeSearchesData>({
    remainingSearches: MAX_FREE_SEARCHES,
    totalSearchesUsed: 0,
    hasUsedFreeSearches: false,
  });
  const [hasSubscription, setHasSubscription] = useState(false);

  // Load free searches from localStorage
  useEffect(() => {
    const loadFreeSearches = () => {
      const storageKey = isSignedIn && userId ? `freeSearches_${userId}` : 'freeSearches_anonymous';
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        setFreeSearches({
          remainingSearches: data.remainingSearches,
          totalSearchesUsed: data.totalSearchesUsed,
          hasUsedFreeSearches: data.hasUsedFreeSearches,
        });
      } else {
        const initialData = {
          remainingSearches: MAX_FREE_SEARCHES,
          totalSearchesUsed: 0,
          hasUsedFreeSearches: false,
        };
        localStorage.setItem(storageKey, JSON.stringify(initialData));
        setFreeSearches(initialData);
      }
    };

    // Check if user has an active subscription
    const checkSubscription = () => {
      const subscription = localStorage.getItem('userSubscription');
      if (subscription) {
        const subData = JSON.parse(subscription);
        const today = new Date().toISOString().split('T')[0];
        if (subData.status === 'active' && subData.endDate >= today) {
          setHasSubscription(true);
        } else {
          setHasSubscription(false);
        }
      } else {
        setHasSubscription(false);
      }
    };

    loadFreeSearches();
    checkSubscription();
  }, [isSignedIn, userId]);

  const canPerformSearch = (): boolean => {
    // If user has active subscription, always allow
    if (hasSubscription) {
      return true;
    }
    // Otherwise check free searches remaining
    return freeSearches.remainingSearches > 0;
  };

  const getRemainingFreeSearches = (): number => {
    if (hasSubscription) return Infinity;
    return freeSearches.remainingSearches;
  };

  const useFreeSearch = (): boolean => {
    if (hasSubscription) {
      // Subscribed users have unlimited searches
      return true;
    }
    
    if (freeSearches.remainingSearches <= 0) {
      return false;
    }

    const storageKey = isSignedIn && userId ? `freeSearches_${userId}` : 'freeSearches_anonymous';
    const updatedData = {
      remainingSearches: freeSearches.remainingSearches - 1,
      totalSearchesUsed: freeSearches.totalSearchesUsed + 1,
      hasUsedFreeSearches: true,
    };
    
    localStorage.setItem(storageKey, JSON.stringify(updatedData));
    setFreeSearches(updatedData);
    return true;
  };

  const resetFreeSearches = () => {
    const storageKey = isSignedIn && userId ? `freeSearches_${userId}` : 'freeSearches_anonymous';
    const resetData = {
      remainingSearches: MAX_FREE_SEARCHES,
      totalSearchesUsed: 0,
      hasUsedFreeSearches: false,
    };
    localStorage.setItem(storageKey, JSON.stringify(resetData));
    setFreeSearches(resetData);
  };

  return {
    freeSearches,
    hasSubscription,
    canPerformSearch,
    getRemainingFreeSearches,
    useFreeSearch,
    resetFreeSearches,
    MAX_FREE_SEARCHES,
  };
}