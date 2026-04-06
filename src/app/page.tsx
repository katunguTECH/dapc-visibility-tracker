import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/icons/starter-cheetah.jpg", price: "1,999", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/icons/boost-buffalo.jpg", price: "3,999", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/icons/growthengine-rhino.jpg", price: "5,999", features: ["Website visibility improvement", "Track WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/icons/marketleader-elephant.jpg", price: "7,999", features: ["AI-driven search optimization", "Competitor comparisons", "Advanced performance tracking"] },
  { name: "Super Active", icon: "/icons/superactivevisibility-lion.jpg", price: "10,000", features: ["National & International optimization", "Priority optimization", "Clear monthly performance insights"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={40} priority />
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-800 transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero & Search */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-blue-700 font-bold uppercase tracking-widest text-sm mb-4">Kenya Market Intelligence</h2>
        <h1 className="text-5xl font-black mb-6 text-slate-900 leading-tight">
          Is Your Business <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto">
          Audit your digital footprint across Nairobi instantly.
        </p>
        
        <div className="max-w-xl mx-auto flex gap-2 p-2 border rounded-xl shadow-sm mb-20 bg-white">
          <input 
            type="text" 
            placeholder="Enter Business Name..." 
            className="flex-1 px-4 outline-none text-slate-800" 
          />
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition">
            <SearchIcon size={18} /> Run Free Audit
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="border rounded-2xl p-6 flex flex-col hover:shadow-lg transition bg-white">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image 
                  src={plan.icon} 
                  alt={plan.name} 
                  fill 
                  className="rounded-full object-cover border-2 border-slate-50" 
                />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 leading-tight">{plan.name}</h3>
              <p className="text-2xl font-black text-blue-700 mb-4">
                KES {plan.price}<span className="text-xs text-slate-400 font-normal">/mo</span>
              </p>
              <ul className="text-left space-y-3 mb-6 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-xs text-slate-600 flex gap-2">
                    <Check size={14} className="text-blue-600 shrink-0 mt-0.5" /> 
                    <span>{f}</span>
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
        <p className="text-slate-400 text-sm font-medium">© 2026 DAPC AFRICA • Market Intelligence</p>
        <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-700 transition">Legal</a>
          <a href="#" className="hover:text-blue-700 transition">Security</a>
          <a href="#" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}