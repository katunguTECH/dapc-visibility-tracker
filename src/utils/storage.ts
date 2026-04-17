// src/utils/storage.ts

export interface Transaction {
  id: string;
  phone: string;
  amount: number;
  planName: string;
  transactionDate: string;
  status: 'completed' | 'pending' | 'failed';
  mpesaReceipt?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface Subscriber {
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
  transactionId: string;
  mpesaReceipt?: string;
  lastLogin?: string;
  totalSearches?: number;
}

// Save a new transaction
export function saveTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.unshift(transaction); // Add to beginning
  localStorage.setItem('dapc_transactions', JSON.stringify(transactions));
  
  // If transaction is completed, also save/update subscriber
  if (transaction.status === 'completed') {
    saveOrUpdateSubscriber(transaction);
  }
}

// Get all transactions
export function getTransactions(): Transaction[] {
  const stored = localStorage.getItem('dapc_transactions');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

// Get filtered transactions
export function getFilteredTransactions(startDate?: string, endDate?: string): Transaction[] {
  let transactions = getTransactions();
  
  if (startDate) {
    transactions = transactions.filter(t => t.transactionDate >= startDate);
  }
  if (endDate) {
    transactions = transactions.filter(t => t.transactionDate <= endDate);
  }
  
  return transactions;
}

// Save or update subscriber from transaction
function saveOrUpdateSubscriber(transaction: Transaction): void {
  const subscribers = getSubscribers();
  const existingIndex = subscribers.findIndex(s => s.phone === transaction.phone);
  
  const newSubscriber: Subscriber = {
    id: transaction.id,
    name: transaction.customerName || `Customer ${transaction.phone.slice(-4)}`,
    email: transaction.customerEmail || `${transaction.phone}@user.com`,
    phone: transaction.phone,
    packageName: transaction.planName,
    amount: transaction.amount,
    startDate: transaction.transactionDate,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    features: getFeaturesForPlan(transaction.planName),
    transactionId: transaction.id,
    mpesaReceipt: transaction.mpesaReceipt,
    lastLogin: transaction.transactionDate,
    totalSearches: 0,
  };
  
  if (existingIndex >= 0) {
    subscribers[existingIndex] = { ...subscribers[existingIndex], ...newSubscriber };
  } else {
    subscribers.push(newSubscriber);
  }
  
  localStorage.setItem('dapc_subscribers', JSON.stringify(subscribers));
}

// Get all subscribers
export function getSubscribers(): Subscriber[] {
  const stored = localStorage.getItem('dapc_subscribers');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

// Get active subscribers
export function getActiveSubscribers(): Subscriber[] {
  const subscribers = getSubscribers();
  const today = new Date().toISOString().split('T')[0];
  return subscribers.filter(s => s.status === 'active' && s.endDate >= today);
}

// Get plan features
function getFeaturesForPlan(planName: string): string[] {
  const features: Record<string, string[]> = {
    'Starter Listing': ['Local SEO Scan', 'Business information cleanup', 'Improved local presence'],
    'Local Boost': ['Competitor Tracking', 'Google Maps optimization', 'Targeted search terms'],
    'Growth Engine': ['Social Media Audit', 'Website visibility', 'Lead tracking'],
    'Market Leader': ['Market Intelligence', 'Competitor comparisons', 'Advanced tracking'],
    'Super Visibility': ['Full Visibility Suite', 'Maximum exposure', 'Priority optimization'],
    'Custom Corporate Package': ['Tailored Solutions', 'Enterprise Support', 'Custom Strategy']
  };
  return features[planName] || ['Visibility tracking', 'Performance reports'];
}

// Update subscriber status
export function updateSubscriberStatus(subscriberId: string, status: 'active' | 'expired' | 'cancelled'): void {
  const subscribers = getSubscribers();
  const index = subscribers.findIndex(s => s.id === subscriberId);
  if (index >= 0) {
    subscribers[index].status = status;
    localStorage.setItem('dapc_subscribers', JSON.stringify(subscribers));
  }
}

// Get revenue summary
export function getRevenueSummary(): {
  totalRevenue: number;
  monthlyRevenue: number;
  subscriptionCount: number;
  averageSubscription: number;
} {
  const subscribers = getActiveSubscribers();
  const totalRevenue = subscribers.reduce((sum, s) => sum + s.amount, 0);
  const subscriptionCount = subscribers.length;
  const averageSubscription = subscriptionCount > 0 ? totalRevenue / subscriptionCount : 0;
  
  // Calculate monthly revenue (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const transactions = getTransactions();
  const monthlyRevenue = transactions
    .filter(t => t.status === 'completed' && new Date(t.transactionDate) >= thirtyDaysAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalRevenue,
    monthlyRevenue,
    subscriptionCount,
    averageSubscription,
  };
}