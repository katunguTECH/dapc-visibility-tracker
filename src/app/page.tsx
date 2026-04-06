import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter", icon: "/icons/starter-cheetah.jpg", price: "1,999", features: ["Visibility audit", "Score report", "Basic optimization"], highlight: false },
  { name: "Growth", icon: "/icons/boost-buffalo.jpg", price: "3,999", features: ["Maps ranking boost", "Keyword targeting", "Lead tracking"], highlight: true },
  { name: "Pro", icon: "/icons/growthengine-rhino.jpg", price: "5,999", features: ["Website visibility", "WhatsApp leads", "Growth insights"], highlight: false },
  { name: "Elite", icon: "/icons/marketleader-elephant.jpg", price: "7,999", features: ["AI optimization", "Competitor tracking", "Advanced analytics"], highlight: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white/70 backdrop-blur sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC" width={120} height={40} />
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold hover:text-blue-700">Login</button>
            </SignInButton>
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:scale-105 transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* HERO WITH DASHBOARD */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Your Business Is Invisible Online.
            <br />
            <span className="text-blue-700">We Fix That.</span>
          </h1>

          <p className="text-slate-500 mb-6">
            See your rankings, missed customers, and growth opportunities instantly.
          </p>

          <div className="flex gap-4 mb-6">
            <input className="flex-1 px-4 py-3 rounded-xl border" placeholder="Enter business name..." />
            <button className="bg-blue-700 text-white px-6 rounded-xl font-bold flex items-center gap-2">
              <SearchIcon size={18} /> Audit
            </button>
          </div>

          <div className="text-sm text-slate-400">
            ✔ Real-time audit ✔ No signup ✔ Nairobi-ready
          </div>
        </div>

        {/* REAL DASHBOARD UI */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-black text-white rounded-xl p-4">
            <p className="text-xs opacity-60">Visibility Score</p>
            <p className="text-3xl font-black text-red-400">38/100</p>
            <p className="text-xs text-yellow-400">Critical</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400">Google Rank</p>
            <p className="font-bold text-lg">#21</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400">Missed Leads</p>
            <p className="font-bold text-lg">90/mo</p>
          </div>

          <div className="col-span-2 bg-blue-600 text-white rounded-xl p-4">
            <p className="text-xs opacity-80">Top Insight</p>
            <p className="font-bold">You are losing customers to 17 competitors</p>
          </div>
        </div>
      </section>

      {/* DARK STRIP */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-3xl font-black mb-4">Businesses Like Yours Lose</h2>
        <p className="text-5xl font-black text-red-500 mb-4">KES 50K – 200K/month</p>
        <p className="text-sm opacity-70">due to poor Google visibility</p>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-black text-center mb-12">Choose Your Growth Tier</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`relative rounded-3xl p-6 border bg-white transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.highlight ? "scale-110 border-2 border-blue-600 shadow-2xl" : "opacity-90 hover:opacity-100"}`}>

              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-700 text-white text-xs px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="w-20 h-20 mx-auto mb-6 relative">
                <Image src={plan.icon} alt={plan.name} fill className="rounded-full object-cover border-4 border-white shadow-lg" />
              </div>

              <h3 className="text-center font-bold text-lg mb-2">{plan.name}</h3>

              <p className="text-center text-3xl font-black text-blue-700 mb-4">KES {plan.price}</p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-sm flex gap-2 items-center">
                    <Check size={14} className="text-blue-600" /> {f}
                  </li>
                ))}
              </ul>

              <MpesaModal amount={plan.price.replace(',', '')} planName={plan.name} />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-slate-400 border-t">
        © 2026 DAPC AFRICA • AI Visibility Intelligence
      </footer>
    </div>
  );
}
