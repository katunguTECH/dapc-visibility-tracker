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
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={40} priority />
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal"><button className="text-sm font-semibold">Login</button></SignInButton>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Get Started</button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-blue-700 font-bold uppercase tracking-widest text-sm mb-4">Kenya Market Intelligence</h2>
        <h1 className="text-5xl font-black mb-6 text-slate-900">Is Your Business <span className="text-blue-700">Visible Online?</span></h1>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto">Audit your digital footprint across Nairobi instantly.</p>

        {/* Search Functionality */}
        <div className="max-w-xl mx-auto flex gap-2 p-2 border rounded-xl shadow-sm mb-20">
          <input type="text" placeholder="Enter Business Name..." className="flex-1 px-4 outline-none" />
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
            <SearchIcon size={18} /> Run Free Audit
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="border rounded-2xl p-6 flex flex-col hover:shadow-lg transition">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-2xl font-black text-blue-700 mb-4">KES {plan.price}<span className="text-xs text-slate-400">/mo</span></p>
              <ul className="text-left space-y-2 mb-6 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-xs text-slate-600 flex gap-2"><Check size={14} className="text-blue-600" /> {f}</li>
                ))}
              </ul>
              {/* M-Pesa Functionality */}
              <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}