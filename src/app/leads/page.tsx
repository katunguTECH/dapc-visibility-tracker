export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Premium Feature</h1>
        <p className="text-slate-600 mb-8">
          We found potential leads for your business. Subscribe to the **Growth Plan** to unlock contact details and automated outreach.
        </p>
        
        <div className="space-y-4">
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all">
            Subscribe for KES 2,500/mo
          </button>
          <p className="text-xs text-slate-400">Secure payment via M-Pesa or Card</p>
        </div>
      </div>
    </div>
  );
}