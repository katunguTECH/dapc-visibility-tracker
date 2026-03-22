"use client"

import Navbar from "@/components/Navbar";
import Image from "next/image";

const dapcPlans = [
  {
    name: "Starter Listing",
    target: "Small or offline businesses",
    price: "1,999",
    icon: "/icons/publiciconsstarter-cheetah.jpg", // Adjusted to match your uploaded filename
    accent: "#60a5fa",
    features: [
      "Proper business set up and visible online",
      "Clean up business information",
      "Visibility Score generated",
      "Foundation for nearby searches"
    ]
  },
  {
    name: "Local Boost",
    target: "Businesses wanting more walk-ins & calls",
    price: "3,999",
    icon: "/icons/publiciconsboost-buffalo.jpg",
    accent: "#3b82f6",
    features: [
      "Improve local searches and Google Maps",
      "Profile optimization",
      "Target custom search terms",
      "Real customer actions (calls, visits)"
    ]
  },
  {
    name: "Growth Engine",
    target: "Businesses ready for consistent monthly leads",
    price: "5,999",
    icon: "/icons/publiciconsgrowthengine-rhino.jpg",
    accent: "#2563eb",
    popular: true,
    features: [
      "Improve website visibility",
      "Target multiple search keywords",
      "Track real leads (WhatsApp, Calls)",
      "Clear progress tracking in-app"
    ]
  },
  {
    name: "Market Leader",
    target: "Businesses in competitive industries",
    price: "7,999",
    icon: "/icons/publiciconsmarketleader-elephant.jpg",
    accent: "#1d4ed8",
    features: [
      "Position ahead of competitors",
      "Optimize for AI-search platforms",
      "Competitor performance tracking",
      "Score improvement reports"
    ]
  },
  {
    name: "Super Active Visibility",
    target: "Ambitious brands seeking maximum exposure",
    price: "10,000",
    icon: "/icons/publiciconssuperactivevisibility-lion.jpg",
    accent: "#1e3a8a",
    features: [
      "Maximum exposure (Local, National, Int'l)",
      "Improve AI platform recognition",
      "Priority optimization",
      "Clear monthly performance insights"
    ]
  }
];

export default function SubscribePage() {
  const scrollToPayment = () => {
    document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-16 px-6 text-center">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Choose Your <span className="text-blue-600">Visibility</span> Plan
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the monthly rate that fits your business goals. Unlock lead contact details and expert performance tracking.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mb-24">
          {dapcPlans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-[2rem] shadow-xl border-2 ${
                plan.popular ? 'border-blue-600 ring-4 ring-blue-50' : 'border-slate-100'
              } p-8 relative flex flex-col transition-transform hover:scale-[1.02]`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-8">
                {/* ICON CONTAINER */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner flex-shrink-0 bg-slate-200 relative">
                  <Image 
                    src={plan.icon} 
                    alt={plan.name} 
                    fill
                    sizes="80px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{plan.name}</h2>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">{plan.target}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-sm font-bold text-slate-400">KES</span>
                <span className="text-5xl font-black text-slate-900 mx-1">{plan.price}</span>
                <span className="text-sm font-medium text-slate-400">/mo</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-600 text-sm">
                    <span className="text-blue-500 mt-1 font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={scrollToPayment}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                  plan.popular 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        {/* M-Pesa Payment Section */}
        <section id="payment-section" className="max-w-3xl mx-auto scroll-mt-24">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden text-left">
            <div className="bg-blue-600 py-6 px-10">
              <h3 className="text-white font-black text-2xl flex items-center gap-3">
                📱 Direct M-Pesa Payment
              </h3>
              <p className="text-blue-100 text-sm">Follow these steps to activate your account immediately.</p>
            </div>
            
            <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Business Paybill</p>
                  <p className="text-5xl font-black text-blue-900 tracking-tighter">516600</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Account Number</p>
                  <p className="text-3xl font-bold text-slate-800 tracking-tight">0675749001</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-blue-800 text-sm font-medium">
                    💡 <strong>Tip:</strong> Once paid, your visibility dashboard and lead contact details will unlock automatically.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex-shrink-0">
                <div className="w-32 h-32 bg-white rounded-xl mb-3 flex items-center justify-center shadow-inner relative">
                   <span className="text-[4rem]">🇰🇪</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan to Pay</span>
              </div>
            </div>
          </div>

          <footer className="mt-16 text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase opacity-60">
            DRIVE AFRICA PERFORMANCE CENTER • ODYSSEY PLAZA • SOUTH 'B' NAIROBI • KENYA
          </footer>
        </section>
      </div>
    </main>
  );
}