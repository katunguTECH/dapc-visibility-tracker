import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/starter-cheetah.jpg", price: "1,999", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/boost-buffalo.jpg", price: "3,999", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/growthengine-rhino.jpg", price: "5,999", features: ["Website visibility improvement", "Track WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/marketleader-elephant.jpg", price: "7,999", features: ["AI-driven search optimization", "Competitor comparisons", "Advanced performance tracking"] },
  { name: "Super Active", icon: "/superactivevisibility-lion.jpg", price: "10,000", features: ["National & International optimization", "Priority optimization", "Clear monthly performance insights"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={40} className="object-contain" priority />
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-slate-600 hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-black hover:bg-blue-800 shadow-md transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6 text-center bg-white border-b">
        <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">
          Kenya Market Intelligence
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
          Is Your Business <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
          Audit your digital footprint across Nairobi instantly.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100">
          <input 
            type="text" 
            placeholder="Enter Business Name..." 
            className="flex-1 px-6 py-3 outline-none text-slate-800 text-lg"
          />
          <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg">
            <SearchIcon size={20} /> Run Free Audit
          </button>
        </div>
      </header>

      {/* Pricing Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-16 uppercase tracking-tight">Monthly Rates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-24 h-24 mb-6">
                <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover border-4 border-slate-50 shadow-sm" />
              </div>
              
              <h3 className="text-lg font-black text-slate-900 text-center mb-1 leading-none">{plan.name}</h3>
              <div className="mt-4 mb-6 text-center">
                <span className="text-[10px] font-black text-slate-400 mr-1 uppercase">KES</span>
                <span className="text-3xl font-black text-blue-700">{plan.price}</span>
                <span className="text-[10px] font-bold text-slate-400 ml-1">/mo</span>
              </div>

              <ul className="w-full space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-xs font-bold text-slate-600 leading-snug">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full">
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t px-8 text-center">
        <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">© 2026 DAPC AFRICA • Market Intelligence</p>
        <div className="flex justify-center gap-8 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-700 transition">Legal</a>
          <a href="#" className="hover:text-blue-700 transition">Security</a>
          <a href="#" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}