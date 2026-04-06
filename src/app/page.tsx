import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon, ArrowRight } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { 
    name: "Starter Listing", 
    icon: "/icons/starter-cheetah.jpg", 
    price: "1,999", 
    features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"] 
  },
  { 
    name: "Local Boost", 
    icon: "/icons/boost-buffalo.jpg", 
    price: "3,999", 
    features: ["Google Maps optimization", "Target search terms", "Track customer actions"] 
  },
  { 
    name: "Growth Engine", 
    icon: "/icons/growthengine-rhino.jpg", 
    price: "5,999", 
    features: ["Web visibility boost", "WhatsApp inquiries", "Predictable inquiries"] 
  },
  { 
    name: "Market Leader", 
    icon: "/icons/marketleader-elephant.jpg", 
    price: "7,999", 
    features: ["AI search optimization", "Competitor comparisons", "Advanced tracking"] 
  },
  { 
    name: "Super Active", 
    icon: "/icons/superactivevisibility-lion.jpg", 
    price: "10,000", 
    features: ["Global optimization", "Priority support", "Monthly insights"] 
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-slate-100 sticky top-0 z-50">
        <img src="/dapc-logo.jpg" alt="DAPC Logo" className="h-10 w-auto" />
        <div className="flex items-center gap-8">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-slate-500 hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-black transition shadow-lg">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* HERO SECTION - CLEAN AND TEXT-FOCUSED */}
      <header className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 inline-block">
            Kenya Market Intelligence
          </div>
          <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
            Is Your Business <br /> <span className="text-blue-700">Visible Online?</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-xl font-medium leading-relaxed">
            Audit your digital footprint across Nairobi instantly. See your rankings and missed leads before your competitors do.
          </p>
          
          {/* AUDIT SEARCH BAR */}
          <div className="flex gap-3 p-2.5 bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg">
            <div className="flex-1 flex items-center px-4 gap-3">
              <SearchIcon size={20} className="text-slate-300" />
              <input 
                type="text" 
                placeholder="Enter business name..." 
                className="w-full outline-none text-lg font-medium"
              />
            </div>
            <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-blue-800 transition">
              Audit <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* DASHBOARD PREVIEW UI */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 grid grid-cols-2 gap-4 border border-slate-100 shadow-inner">
          <div className="col-span-2 bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1 text-center">Visibility Score</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black text-red-400">38</span>
              <span className="text-lg font-bold opacity-30">/100</span>
            </div>
            <p className="text-xs font-bold text-yellow-400 mt-2 text-center">Critical: Low engagement in Nairobi CBD</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Rank</p>
            <p className="font-black text-2xl text-slate-900">#21</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Missed Leads</p>
            <p className="font-black text-2xl text-slate-900">90/mo</p>
          </div>
        </div>
      </header>

      {/* PRICING SECTION - BIG FIVE ICONS ONLY */}
      <section className="bg-slate-50 py-32 px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Investment Plans</h2>
            <p className="text-4xl font-black text-slate-900">Choose Your Growth Tier</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-200 flex flex-col items-center hover:shadow-2xl transition-all duration-300">
                {/* Animal Icon Container */}
                <div className="w-20 h-20 mb-6 overflow-hidden rounded-full border-2 border-slate-50 shadow-md">
                   <img 
                    src={plan.icon} 
                    alt={plan.name} 
                    className="w-full h-full object-cover" 
                   />
                </div>
                
                <h3 className="text-[11px] font-black text-slate-900 text-center uppercase mb-4 tracking-tighter">
                  {plan.name}
                </h3>
                
                <div className="mb-8 text-center">
                  <p className="text-xl font-black text-blue-700">KES {plan.price}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Per Month</p>
                </div>

                <ul className="w-full space-y-3 mb-10 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-[10px] font-bold text-slate-500 leading-tight">
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
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-100 text-center">
        <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">
          © 2026 DAPC AFRICA • Market Intelligence
        </p>
      </footer>
    </div>
  );
}