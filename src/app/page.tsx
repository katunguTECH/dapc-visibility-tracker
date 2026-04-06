import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter Listing", icon: "/icons/starter-cheetah.jpg", price: "1,999", features: ["Visibility audit", "Score report", "Basic optimization"], highlight: false },
  { name: "Local Boost", icon: "/icons/boost-buffalo.jpg", price: "3,999", features: ["Maps ranking boost", "Keyword targeting", "Lead tracking"], highlight: true },
  { name: "Growth Engine", icon: "/icons/growthengine-rhino.jpg", price: "5,999", features: ["Website visibility", "WhatsApp leads", "Growth insights"], highlight: false },
  { name: "Market Leader", icon: "/icons/marketleader-elephant.jpg", price: "7,999", features: ["AI optimization", "Competitor tracking", "Advanced analytics"], highlight: false },
  { name: "Super Active", icon: "/icons/superactivevisibility-lion.jpg", price: "10,000", features: ["National optimization", "Priority support", "Market dominance"], highlight: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC" width={150} height={45} priority className="object-contain" />
        <div className="flex items-center gap-6">
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

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-blue-100">
            Kenya Market Intelligence
          </span>
          <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            Your Business Is <span className="text-blue-700">Invisible Online.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            Stop losing customers to competitors. See your Nairobi rankings and growth opportunities instantly.
          </p>

          <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg">
            <input className="flex-1 px-4 outline-none text-lg font-medium" placeholder="Enter business name..." />
            <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center gap-2 hover:bg-blue-800 transition">
              <SearchIcon size={20} /> Audit
            </button>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] p-8 grid grid-cols-2 gap-4 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
          <div className="col-span-2 bg-slate-900 text-white rounded-2xl p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Current Visibility Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-red-400 tracking-tighter">38</span>
              <span className="text-lg font-bold opacity-40">/100</span>
            </div>
            <p className="text-xs font-bold text-yellow-400 mt-2">● Critical: Losing ~12 leads per week</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Google Rank</p>
            <p className="font-black text-2xl text-slate-900">#21</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Missed Leads</p>
            <p className="font-black text-2xl text-slate-900">90/mo</p>
          </div>
        </div>
      </header>

      {/* PRICING GRID */}
      <section className="bg-white py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-16">Choose Your Growth Tier</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`relative rounded-[2rem] p-8 border bg-white transition-all hover:shadow-2xl ${plan.highlight ? "ring-2 ring-blue-600 shadow-xl scale-105 z-10" : "border-slate-200"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover border-4 border-slate-50 shadow-md" />
                </div>
                <h3 className="text-center font-black text-sm uppercase tracking-tight mb-2 text-slate-900">{plan.name}</h3>
                <div className="text-center mb-6">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">KES</span>
                  <span className="text-3xl font-black text-blue-700 tracking-tighter">{plan.price}</span>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="text-[11px] font-bold text-slate-500 flex gap-2 leading-tight">
                      <Check size={14} className="text-blue-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        © 2026 DAPC AFRICA • AI Visibility Intelligence
      </footer>
    </div>
  );
}