// src/app/admin-reports/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';

// Admin password
const ADMIN_PASSWORD = 'Nairobi123!';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  mpesaReceipt?: string;
}

interface Transaction {
  id: string;
  phone: string;
  amount: number;
  planName: string;
  transactionDate: string;
  status: string;
  mpesaReceipt?: string;
}

export default function AdminReportsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'transactions'>('subscribers');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample subscriber data
  const subscribers: Subscriber[] = [
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
      mpesaReceipt: 'MPESA001',
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
      mpesaReceipt: 'MPESA002',
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
      mpesaReceipt: 'MPESA003',
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
      mpesaReceipt: 'MPESA004',
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
      mpesaReceipt: 'MPESA005',
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
      mpesaReceipt: 'MPESA006',
    },
    {
      id: '7',
      name: 'James Kariuki',
      email: 'james.kariuki@example.com',
      phone: '0778901234',
      packageName: 'Local Boost',
      amount: 3999,
      startDate: '2026-03-15',
      endDate: '2026-04-15',
      status: 'active',
      mpesaReceipt: 'MPESA007',
    },
    {
      id: '8',
      name: 'Lucy Wambui',
      email: 'lucy.wambui@example.com',
      phone: '0789012345',
      packageName: 'Starter Listing',
      amount: 1999,
      startDate: '2026-03-08',
      endDate: '2026-04-08',
      status: 'active',
      mpesaReceipt: 'MPESA008',
    },
  ];

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      phone: '0712345678',
      amount: 1999,
      planName: 'Starter Listing',
      transactionDate: '2026-03-01T10:30:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA001',
    },
    {
      id: '2',
      phone: '0723456789',
      amount: 3999,
      planName: 'Local Boost',
      transactionDate: '2026-02-15T14:45:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA002',
    },
    {
      id: '3',
      phone: '0734567890',
      amount: 5999,
      planName: 'Growth Engine',
      transactionDate: '2026-03-10T09:15:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA003',
    },
    {
      id: '4',
      phone: '0745678901',
      amount: 7999,
      planName: 'Market Leader',
      transactionDate: '2026-01-01T16:20:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA004',
    },
    {
      id: '5',
      phone: '0756789012',
      amount: 10000,
      planName: 'Super Visibility',
      transactionDate: '2026-03-05T11:00:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA005',
    },
    {
      id: '6',
      phone: '0767890123',
      amount: 25000,
      planName: 'Custom Corporate Package',
      transactionDate: '2026-03-12T13:30:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA006',
    },
    {
      id: '7',
      phone: '0778901234',
      amount: 3999,
      planName: 'Local Boost',
      transactionDate: '2026-03-15T15:45:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA007',
    },
    {
      id: '8',
      phone: '0789012345',
      amount: 1999,
      planName: 'Starter Listing',
      transactionDate: '2026-03-08T12:00:00Z',
      status: 'completed',
      mpesaReceipt: 'MPESA008',
    },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setPasswordError('');
      setPassword('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const exportToCSV = () => {
    let headers: string[] = [];
    let data: any[][] = [];

    if (activeTab === 'subscribers') {
      headers = ['Name', 'Email', 'Phone', 'Package', 'Amount (KES)', 'Start Date', 'End Date', 'Status', 'MPesa Receipt'];
      data = filteredSubscribers.map(sub => [
        sub.name,
        sub.email,
        sub.phone,
        sub.packageName,
        sub.amount,
        sub.startDate,
        sub.endDate,
        sub.status,
        sub.mpesaReceipt || 'N/A',
      ]);
    } else {
      headers = ['Date', 'Phone', 'Amount (KES)', 'Plan', 'Status', 'Receipt'];
      data = filteredTransactions.map(trans => [
        new Date(trans.transactionDate).toLocaleDateString(),
        trans.phone,
        trans.amount,
        trans.planName,
        trans.status,
        trans.mpesaReceipt || 'N/A',
      ]);
    }

    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

  const filteredTransactions = transactions.filter(trans => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        trans.phone.includes(term) ||
        trans.planName.toLowerCase().includes(term) ||
        (trans.mpesaReceipt && trans.mpesaReceipt.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    totalRevenue: subscribers.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
    totalTransactions: transactions.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Password screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Reports</h1>
            <p className="text-gray-600 mt-2">Enter the admin password to access reports</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-lg"
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-red-600 mt-2 text-center">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Access Reports
            </button>
            <Link href="/">
              <button type="button" className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                Back to Home
              </button>
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // Main reports page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/dapc-logo2.jpg" alt="DAPC Logo" className="w-10 h-10 object-contain rounded-lg" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Reports Dashboard
                </h1>
                <p className="text-xs text-gray-500">Subscriber & Transaction Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              <button
                onClick={() => {
                  setIsAuthorized(false);
                }}
                className="text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Subscribers</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSubscribers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</p>
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
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">KES {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`pb-4 px-1 font-medium transition ${
                activeTab === 'subscribers'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Subscribers ({subscribers.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`pb-4 px-1 font-medium transition ${
                activeTab === 'transactions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Transactions ({transactions.length})
            </button>
          </nav>
        </div>

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {['all', 'active', 'expired', 'cancelled'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone or package..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                  />
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email/Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{sub.name}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-600">{sub.email}</div>
                          <div className="text-xs text-gray-400">{sub.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{sub.packageName}</td>
                        <td className="px-6 py-4 text-gray-700">KES {sub.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-500">{sub.startDate}</td>
                        <td className="px-6 py-4 text-gray-500">{sub.endDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{sub.mpesaReceipt || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <input
                  type="text"
                  placeholder="Search by phone, plan, or receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                />
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((trans) => (
                      <tr key={trans.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(trans.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{trans.phone}</td>
                        <td className="px-6 py-4 text-gray-700">{trans.planName}</td>
                        <td className="px-6 py-4 text-gray-700">KES {trans.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trans.status)}`}>
                            {trans.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">{trans.mpesaReceipt || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}