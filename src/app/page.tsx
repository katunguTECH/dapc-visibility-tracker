import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/starter-cheetah.jpg", price: "1,999", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/boost-buffalo.jpg", price: "3,999", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/growthengine-rhino.jpg", price: "5,999", features: ["Web visibility boost", "WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/marketleader-elephant.jpg", price: "7,999", features: ["AI search optimization", "Competitor comparisons", "Advanced tracking"] },
  { name: "Super Active", icon: "/superactivevisibility-lion.jpg", price: "10,000", features: ["Global optimization", "Priority support", "Monthly insights"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={40} priority />
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-blue-700 font-bold uppercase tracking-widest text-xs mb-4">Kenya Market Intelligence</h2>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
          Is Your Business <br/> <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Audit your digital footprint across Nairobi instantly with our AI-driven tracker.
        </p>
        
        {/* Search Functionality */}
        <div className="max-w-xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 mb-24">
          <input 
            type="text" 
            placeholder="Search your business name..." 
            className="flex-1 px-4 py-3 outline-none text-slate-800"
          />
          <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition">
            <SearchIcon size={18} /> Run Free Audit
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:border-blue-400 hover:shadow-xl transition-all group">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Image 
                  src={plan.icon} 
                  alt={plan.name} 
                  fill 
                  className="rounded-full object-cover border-2 border-slate-50 group-hover:border-blue-100"
                />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 uppercase text-xs tracking-tighter">{plan.name}</h3>
              <p className="text-2xl font-black text-blue-700 mb-6">
                KES {plan.price}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
              </p>
              <ul className="text-left space-y-3 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-[11px] font-bold text-slate-500 flex gap-2">
                    <Check size={14} className="text-blue-600 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t bg-slate-50 px-8 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 DAPC AFRICA • Market Intelligence</p>
        <div className="flex justify-center gap-8 mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <a href="#" className="hover:text-blue-700 transition">Legal</a>
          <a href="#" className="hover:text-blue-700 transition">Security</a>
          <a href="#" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}