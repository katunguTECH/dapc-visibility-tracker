// src/app/admin-reports/page.tsx
"use client";

import { useState, useEffect } from 'react';
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
  transactionDate?: string;
}

interface Transaction {
  id: string;
  phone: string;
  amount: number;
  planName: string;
  transactionDate: string;
  status: string;
  mpesaReceipt?: string;
  customerName?: string;
  customerEmail?: string;
}

export default function AdminReportsPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'subscribers' | 'transactions'>('subscribers');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '2026-04-01', end: '' });
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    revenueSinceApril1: 0,
    transactionsSinceApril1: 0,
  });

  // Load real data from localStorage
  const loadRealData = () => {
    setLoading(true);
    
    // Load subscribers from localStorage
    const storedSubscribers = localStorage.getItem('dapc_subscribers');
    let loadedSubscribers: Subscriber[] = [];
    
    if (storedSubscribers) {
      loadedSubscribers = JSON.parse(storedSubscribers);
    } else {
      // Check for userSubscription as fallback
      const userSub = localStorage.getItem('userSubscription');
      if (userSub) {
        const sub = JSON.parse(userSub);
        if (sub.packageName) {
          loadedSubscribers = [{
            id: '1',
            name: sub.name || 'Customer',
            email: sub.email || 'unknown@email.com',
            phone: sub.phone || 'N/A',
            packageName: sub.packageName,
            amount: sub.amount,
            startDate: sub.startDate || new Date().toISOString().split('T')[0],
            endDate: sub.endDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
            status: sub.status || 'active',
            mpesaReceipt: sub.mpesaReceipt,
            transactionDate: sub.startDate,
          }];
        }
      }
    }
    
    // Load transactions from localStorage
    const storedTransactions = localStorage.getItem('dapc_transactions');
    let loadedTransactions: Transaction[] = [];
    
    if (storedTransactions) {
      loadedTransactions = JSON.parse(storedTransactions);
    } else {
      // Check for any payment records
      const payments = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('payment') || key.includes('mpesa') || key.includes('transaction'))) {
          try {
            const payment = JSON.parse(localStorage.getItem(key) || '{}');
            if (payment.amount) {
              payments.push(payment);
            }
          } catch (e) {}
        }
      }
      loadedTransactions = payments.map((p, idx) => ({
        id: idx.toString(),
        phone: p.phone || 'N/A',
        amount: p.amount,
        planName: p.planName || 'Unknown',
        transactionDate: p.date || new Date().toISOString(),
        status: p.status || 'completed',
        mpesaReceipt: p.receipt || `MPESA${Date.now()}`,
      }));
    }
    
    // Calculate statistics
    const april1 = new Date('2026-04-01');
    const transactionsSinceApril1 = loadedTransactions.filter(t => 
      new Date(t.transactionDate) >= april1 && t.status === 'completed'
    );
    const revenueSinceApril1 = transactionsSinceApril1.reduce((sum, t) => sum + t.amount, 0);
    
    setSubscribers(loadedSubscribers);
    setTransactions(loadedTransactions);
    setStats({
      totalSubscribers: loadedSubscribers.length,
      activeSubscribers: loadedSubscribers.filter(s => s.status === 'active').length,
      totalRevenue: loadedSubscribers.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
      totalTransactions: loadedTransactions.length,
      revenueSinceApril1: revenueSinceApril1,
      transactionsSinceApril1: transactionsSinceApril1.length,
    });
    setLoading(false);
  };

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setPasswordError('');
      setPassword('');
      loadRealData();
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    let headers: string[] = [];
    let data: any[][] = [];

    if (activeTab === 'subscribers') {
      headers = ['Name', 'Email', 'Phone', 'Package', 'Amount (KES)', 'Start Date', 'End Date', 'Status', 'MPesa Receipt', 'Transaction Date'];
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
        sub.transactionDate || 'N/A',
      ]);
    } else {
      headers = ['Date', 'Phone', 'Amount (KES)', 'Plan', 'Status', 'Receipt', 'Customer Name', 'Customer Email'];
      data = filteredTransactions.map(trans => [
        new Date(trans.transactionDate).toLocaleDateString(),
        trans.phone,
        trans.amount,
        trans.planName,
        trans.status,
        trans.mpesaReceipt || 'N/A',
        trans.customerName || 'N/A',
        trans.customerEmail || 'N/A',
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

  // Filter subscribers
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

  // Filter transactions by date range
  const filteredTransactions = transactions.filter(trans => {
    if (dateRange.start) {
      const transDate = new Date(trans.transactionDate).toISOString().split('T')[0];
      if (transDate < dateRange.start) return false;
    }
    if (dateRange.end) {
      const transDate = new Date(trans.transactionDate).toISOString().split('T')[0];
      if (transDate > dateRange.end) return false;
    }
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
            <p className="text-gray-600 mt-2">Enter the admin password to access real-time reports</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                  Real-Time Admin Reports
                </h1>
                <p className="text-xs text-gray-500">Live Subscriber & Transaction Data</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Subscribers</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalSubscribers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Active Subscribers</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold text-purple-600">KES {stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalTransactions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 bg-green-50">
            <p className="text-xs text-gray-600">Revenue Since Apr 1</p>
            <p className="text-xl font-bold text-green-700">KES {stats.revenueSinceApril1.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 bg-blue-50">
            <p className="text-xs text-gray-600">Transactions Since Apr 1</p>
            <p className="text-2xl font-bold text-blue-700">{stats.transactionsSinceApril1}</p>
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
                  <button
                    onClick={loadRealData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Refresh Data
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
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          No subscribers found. Data will appear when users subscribe.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
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
                      ))
                    )}
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
                <div className="flex gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
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
                  <button
                    onClick={loadRealData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Refresh Data
                  </button>
                </div>
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
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No transactions found for the selected date range.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((trans) => (
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
                        </td>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Note about real data */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            📊 <strong>Note:</strong> This dashboard shows real data from your localStorage. 
            Transactions are saved when users complete M-Pesa payments. 
            Use the <strong>"Refresh Data"</strong> button to load the latest information.
            Date filter defaults to April 1, 2026 for "Since April 1" statistics.
          </p>
        </div>
      </main>
    </div>
  );
}