import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon, ArrowRight } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/starter-cheetah.jpg", price: "1,999", color: "from-orange-500/10", features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] },
  { name: "Local Boost", icon: "/boost-buffalo.jpg", price: "3,999", color: "from-blue-500/10", features: ["Google Maps optimization", "Target search terms", "Track customer actions"] },
  { name: "Growth Engine", icon: "/growthengine-rhino.jpg", price: "5,999", color: "from-slate-500/10", features: ["Web visibility boost", "WhatsApp inquiries", "Predictable inquiries"] },
  { name: "Market Leader", icon: "/marketleader-elephant.jpg", price: "7,999", color: "from-indigo-500/10", features: ["AI search optimization", "Competitor comparisons", "Advanced tracking"] },
  { name: "Super Active", icon: "/superactivevisibility-lion.jpg", price: "10,000", color: "from-yellow-500/10", features: ["Global optimization", "Priority support", "Monthly insights"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Premium Glass Nav */}
      <nav className="flex items-center justify-between px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={140} height={38} className="brightness-110" priority />
        <div className="flex items-center gap-8">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[13px] font-bold text-slate-500 hover:text-blue-700 transition-colors">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-[13px] font-black hover:bg-black hover:shadow-2xl transition-all duration-300">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* Hero Section: High Contrast */}
      <header className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1 rounded-full shadow-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">Kenya Market Intelligence</span>
          </div>
          
          <h1 className="text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.05]">
            Is Your Business <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Visible Online?</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Instantly audit your digital footprint across Nairobi with our proprietary AI-driven market tracker.
          </p>
          
          {/* Hero Search: Neumorphic style */}
          <div className="max-w-2xl mx-auto flex gap-3 p-2.5 bg-white rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-slate-100/50">
            <div className="flex-1 flex items-center px-4 gap-3 border-r border-slate-100">
              <SearchIcon size={20} className="text-slate-300" />
              <input 
                type="text" 
                placeholder="Business Name (e.g. Java House)" 
                className="w-full outline-none text-slate-800 text-lg placeholder:text-slate-300 font-medium"
              />
            </div>
            <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-black transition-all active:scale-95">
              Run Free Audit <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Pricing: The Big Five Cards */}
      <section className="py-32 px-10 max-w-[1500px] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Monthly Investment</h2>
          <p className="text-3xl font-black text-slate-900">Choose Your Tier</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 p-8 flex flex-col items-center hover:border-blue-500/30 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
              {/* Background Accent */}
              <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} to-transparent opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity duration-500`} />
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="relative w-28 h-28 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white rounded-full shadow-xl" />
                  <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover p-1.5" />
                </div>
                
                <h3 className="text-[15px] font-black text-slate-900 text-center uppercase tracking-tight mb-6">{plan.name}</h3>
                
                <div className="mb-10 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[10px] font-black text-slate-400">KES</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                    <span className="text-[10px] font-bold text-slate-400">/mo</span>
                  </div>
                </div>

                <ul className="w-full space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500 leading-snug">
                      <div className="bg-blue-50 rounded-full p-0.5 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="w-full relative z-20">
                  <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Dark Footer */}
      <footer className="py-24 bg-black text-white px-10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <Image src="/dapc-logo.jpg" alt="DAPC Logo" width={120} height={35} className="grayscale invert mb-10 opacity-50" />
          <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mb-8">© 2026 DAPC AFRICA • Market Intelligence</p>
          <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-blue-500 transition-colors">Legal</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Security</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}