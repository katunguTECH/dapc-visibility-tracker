// src/app/admin/reports/page.tsx
"use client";

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  features: string[];
  lastLogin?: string;
  totalSearches?: number;
}

// Admin emails - ONLY these users can access the reports
const ADMIN_EMAILS = [
  'info@dapc.co.ke',
  'katungu1@gmail.com',
  'n.waswani@dapc.co.ke',
  'h.munyoki@dapc.co.ke',
  'k.ouko@dapc.co.ke'
];

const ADMIN_PASSWORD = 'Nairobi123!';

export default function AdminReportsPage() {
  const { isSignedIn, user } = useAuth();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Check if user is admin
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const userEmail = user.primaryEmailAddress.emailAddress;
      if (ADMIN_EMAILS.includes(userEmail)) {
        // Valid admin email, check password
        const hasEnteredPassword = sessionStorage.getItem('admin_auth') === 'true';
        if (hasEnteredPassword) {
          setIsAdmin(true);
          loadSubscribers();
        } else {
          setShowPasswordModal(true);
        }
      } else {
        router.push('/dashboard');
      }
    } else if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, user, router]);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setShowPasswordModal(false);
      setIsAdmin(true);
      loadSubscribers();
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const loadSubscribers = () => {
    // Load all subscriptions from localStorage
    // In production, this would come from a database
    const allSubscribers: Subscriber[] = [];
    
    // Get all keys from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === 'userSubscription') {
        try {
          const subscription = JSON.parse(localStorage.getItem(key) || '{}');
          if (subscription.packageName) {
            allSubscribers.push({
              id: 'local_user',
              name: subscription.name || 'Anonymous User',
              email: subscription.email || 'no-email@provided.com',
              phone: subscription.phone || 'N/A',
              packageName: subscription.packageName,
              amount: subscription.amount,
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              status: subscription.status,
              features: subscription.features || [],
              lastLogin: new Date().toISOString(),
              totalSearches: subscription.totalSearches || 0,
            });
          }
        } catch (e) {
          console.error('Error parsing subscription:', e);
        }
      }
    }

    // Also check for free searches users (potential leads)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('freeSearches_')) {
        try {
          const freeData = JSON.parse(localStorage.getItem(key) || '{}');
          if (freeData.totalSearchesUsed > 0) {
            allSubscribers.push({
              id: key,
              name: 'Free Trial User',
              email: 'not-signed-up@user.com',
              phone: 'N/A',
              packageName: 'Free Trial (5 searches)',
              amount: 0,
              startDate: new Date().toISOString().split('T')[0],
              endDate: 'N/A',
              status: 'expired',
              features: ['5 Free Searches'],
              lastLogin: new Date().toISOString(),
              totalSearches: freeData.totalSearchesUsed,
            });
          }
        } catch (e) {
          console.error('Error parsing free searches:', e);
        }
      }
    }

    setSubscribers(allSubscribers);
    setLoading(false);
  };

  // For demo purposes, add sample data if no subscribers exist
  useEffect(() => {
    if (subscribers.length === 0 && !loading && isAdmin) {
      const sampleSubscribers: Subscriber[] = [
        {
          id: '1',
          name: 'John Mwangi',
          email: 'john.mwangi@example.com',
          phone: '0712345678',
          packageName: 'Starter Listing',
          amount: 1999,
          startDate: '2026-03-01',
          endDate: '2026-03-31',
          status: 'active',
          features: ['Local SEO Scan'],
          lastLogin: '2026-03-15',
          totalSearches: 12,
        },
        {
          id: '2',
          name: 'Mary Wanjiku',
          email: 'mary.wanjiku@example.com',
          phone: '0723456789',
          packageName: 'Local Boost',
          amount: 3999,
          startDate: '2026-02-15',
          endDate: '2026-03-15',
          status: 'expired',
          features: ['Competitor Tracking'],
          lastLogin: '2026-03-10',
          totalSearches: 25,
        },
        {
          id: '3',
          name: 'Peter Ochieng',
          email: 'peter.ochieng@example.com',
          phone: '0734567890',
          packageName: 'Growth Engine',
          amount: 5999,
          startDate: '2026-03-10',
          endDate: '2026-04-10',
          status: 'active',
          features: ['Social Media Audit'],
          lastLogin: '2026-03-16',
          totalSearches: 18,
        },
        {
          id: '4',
          name: 'Sarah Kimani',
          email: 'sarah.kimani@example.com',
          phone: '0745678901',
          packageName: 'Market Leader',
          amount: 7999,
          startDate: '2026-01-01',
          endDate: '2026-01-31',
          status: 'cancelled',
          features: ['Market Intelligence'],
          lastLogin: '2026-01-28',
          totalSearches: 45,
        },
        {
          id: '5',
          name: 'David Otieno',
          email: 'david.otieno@example.com',
          phone: '0756789012',
          packageName: 'Super Visibility',
          amount: 10000,
          startDate: '2026-03-05',
          endDate: '2026-04-05',
          status: 'active',
          features: ['Full Visibility Suite'],
          lastLogin: '2026-03-16',
          totalSearches: 32,
        },
        {
          id: '6',
          name: 'Grace Nduta',
          email: 'grace.nduta@example.com',
          phone: '0767890123',
          packageName: 'Custom Corporate Package',
          amount: 25000,
          startDate: '2026-03-12',
          endDate: '2026-04-12',
          status: 'active',
          features: ['Tailored Solutions', 'Enterprise Support', 'Custom Strategy', 'Priority Service', 'Flexible Pricing'],
          lastLogin: '2026-03-15',
          totalSearches: 8,
        },
      ];
      setSubscribers(sampleSubscribers);
    }
  }, [subscribers.length, loading, isAdmin]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !showPasswordModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <Link href="/dashboard" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (showPasswordModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access Required</h2>
            <p className="text-gray-600 mt-1">Enter the admin password to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-600 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Verify Access
            </button>

            <Link href="/dashboard">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter !== 'all' && sub.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        sub.name.toLowerCase().includes(term) ||
        sub.email.toLowerCase().includes(term) ||
        sub.packageName.toLowerCase().includes(term) ||
        sub.phone.includes(term)
      );
    }
    return true;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    expired: subscribers.filter(s => s.status === 'expired').length,
    cancelled: subscribers.filter(s => s.status === 'cancelled').length,
    totalRevenue: subscribers.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Package', 'Amount (KES)', 'Start Date', 'End Date', 'Status', 'Last Login', 'Total Searches'];
    const csvData = filteredSubscribers.map(sub => [
      sub.name,
      sub.email,
      sub.phone,
      sub.packageName,
      sub.amount,
      sub.startDate,
      sub.endDate,
      sub.status,
      sub.lastLogin || 'N/A',
      sub.totalSearches || 0,
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/dapc-logo2.jpg"
                alt="DAPC Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Reports
                </h1>
                <p className="text-xs text-gray-500">Subscriber Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                Dashboard
              </Link>
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscriber Reports</h1>
          <p className="text-gray-600 mt-1">View and manage all DAPC subscribers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('expired')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'expired' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Expired
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'cancelled' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by name, email, or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
              />
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{sub.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                      <td className="px-6 py-4 text-gray-600">{sub.phone}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{sub.packageName}</div>
                        {sub.features && sub.features.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {sub.features.slice(0, 2).join(', ')}{sub.features.length > 2 ? '...' : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-blue-600">KES {sub.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{sub.startDate}</td>
                      <td className="px-6 py-4 text-gray-600">{sub.endDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}