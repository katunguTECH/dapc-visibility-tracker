import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/starter-cheetah.jpg", price: "1,999", color: "from-orange-50 to-white", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/boost-buffalo.jpg", price: "3,999", color: "from-blue-50 to-white", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/growthengine-rhino.jpg", price: "5,999", color: "from-slate-50 to-white", features: ["Web visibility boost", "WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/marketleader-elephant.jpg", price: "7,999", color: "from-indigo-50 to-white", features: ["AI search optimization", "Competitor comparisons", "Advanced tracking"] },
  { name: "Super Active", icon: "/superactivevisibility-lion.jpg", price: "10,000", color: "from-yellow-50 to-white", features: ["Global optimization", "Priority support", "Monthly insights"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-blue-100">
      {/* SaaS Header */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={150} height={42} className="object-contain" priority />
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-slate-500 hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-200 transition-all">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-blue-700 text-[10px] font-black uppercase tracking-widest">Kenya Market Intelligence</span>
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Is Your Business <br /> <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
          Audit your digital footprint across Nairobi instantly.
        </p>
        
        {/* Search Bar with Elevation */}
        <div className="max-w-2xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          <input 
            type="text" 
            placeholder="Search your business name..." 
            className="flex-1 px-6 outline-none text-slate-800 text-lg placeholder:text-slate-300"
          />
          <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-blue-800 transition active:scale-95">
            <SearchIcon size={20} /> Run Free Audit
          </button>
        </div>
      </header>

      {/* The Big Five Pricing Section */}
      <section className="py-24 px-10 max-w-[1400px] mx-auto">
        <h2 className="text-center text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-16">Monthly Rates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`group bg-gradient-to-b ${plan.color} rounded-[2.5rem] border border-slate-100 p-8 flex flex-col items-center hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500`}>
              <div className="relative w-28 h-28 mb-8">
                <div className="absolute inset-0 bg-white rounded-full shadow-inner" />
                <Image 
                  src={plan.icon} 
                  alt={plan.name} 
                  fill 
                  className="rounded-full object-cover p-1" 
                />
              </div>
              
              <h3 className="text-lg font-black text-slate-900 text-center mb-1 leading-tight uppercase tracking-tight">{plan.name}</h3>
              <div className="my-6 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Starting at</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xs font-bold text-slate-400">KES</span>
                  <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                </div>
              </div>

              <ul className="w-full space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500 leading-snug">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="w-full pt-4 border-t border-slate-100/50">
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-white px-10 text-center">
        <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-6">© 2026 DAPC AFRICA • Market Intelligence</p>
        <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <a href="#" className="hover:text-blue-500 transition">Legal</a>
          <a href="#" className="hover:text-blue-500 transition">Security</a>
          <a href="#" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}