// src/app/leads/page.tsx
export default function LeadsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Unlock Lead Intelligence</h1>
      <p className="text-slate-600 mb-8">You've found 42 potential leads for your business. Subscribe to view their contact details.</p>
      
      <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Growth Plan</h2>
        <p className="text-4xl font-black mb-6">KES 2,500<span className="text-sm font-normal">/month</span></p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
          Subscribe Now
        </button>
      </div>
    </div>
  )
}