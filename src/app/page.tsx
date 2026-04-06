import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Professional Nav */}
      <nav className="flex items-center justify-between px-10 py-4 bg-white border-b sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={40} priority />
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-slate-600 hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-black transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-24 px-6 text-center bg-white border-b">
        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          Kenya Market Intelligence
        </div>
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Is Your Business <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Audit your digital footprint across Nairobi instantly with our AI-driven tracker.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-100">
          <input 
            type="text" 
            placeholder="Search business name..." 
            className="flex-1 px-6 outline-none text-lg text-slate-800"
          />
          <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-blue-800 transition">
            Run Free Audit <ArrowRight size={18} />
          </button>
        </div>
      </header>

      {/* Pricing Grid */}
      <section className="py-24 px-10 max-w-[1400px] mx-auto">
        <h2 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-16">Monthly Investment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex flex-col items-center hover:shadow-2xl transition-all group">
              <div className="relative w-24 h-24 mb-6">
                <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover border-4 border-slate-50 group-hover:border-blue-100 transition-colors" />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-[10px] font-bold text-slate-400">KES</span>
                <span className="text-3xl font-black text-blue-700">{plan.price}</span>
                <span className="text-[10px] font-bold text-slate-400">/mo</span>
              </div>
              <ul className="w-full space-y-4 mb-10 flex-1 text-left">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500">
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
      <footer className="py-16 bg-white border-t text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">© 2026 DAPC AFRICA • Market Intelligence</p>
        <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-blue-700 transition">Legal</a>
          <a href="#" className="hover:text-blue-700 transition">Security</a>
          <a href="#" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}