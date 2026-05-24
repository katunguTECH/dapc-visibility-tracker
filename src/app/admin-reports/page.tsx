"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscription: {
    packageName: string;
    amount: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'cancelled';
  } | null;
}

export default function AdminReportsPage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }
    // Check admin status (you can also fetch from an API that validates admin)
    fetch('/api/admin/all-users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [isSignedIn, router]);

  if (loading) return <div className="p-8 text-center">Loading reports...</div>;

  const filteredUsers = users.filter(u => {
    const sub = u.subscription;
    if (filter !== 'all') {
      if (!sub || sub.status !== filter) return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    }
    return true;
  });

  const activeSubs = users.filter(u => u.subscription?.status === 'active').length;
  const expiredSubs = users.filter(u => u.subscription?.status === 'expired').length;
  const cancelledSubs = users.filter(u => u.subscription?.status === 'cancelled').length;
  const totalRevenue = users.reduce((sum, u) => {
    if (u.subscription?.status === 'active') return sum + (u.subscription.amount || 0);
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Admin Reports</h1>
          <button onClick={() => router.push('/')} className="text-gray-600">Home</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Real-Time User & Subscription Data</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Sign-ups</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Active Subscribers</p>
            <p className="text-2xl font-bold text-green-600">{activeSubs}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Expired</p>
            <p className="text-2xl font-bold text-orange-600">{expiredSubs}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{cancelledSubs}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Revenue (active)</p>
            <p className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded-lg ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Active</button>
            <button onClick={() => setFilter('expired')} className={`px-4 py-2 rounded-lg ${filter === 'expired' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>Expired</button>
            <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-lg ${filter === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Cancelled</button>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-64"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signed Up</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.subscription?.packageName || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      u.subscription?.status === 'active' ? 'bg-green-100 text-green-800' :
                      u.subscription?.status === 'expired' ? 'bg-orange-100 text-orange-800' :
                      u.subscription?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {u.subscription?.status || 'No subscription'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.subscription ? `KES ${u.subscription.amount}` : '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.subscription?.endDate ? new Date(u.subscription.endDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}