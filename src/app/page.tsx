import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Search as SearchIcon } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  { name: "Starter", price: "1,999", features: ["Visibility audit", "Score report", "Basic optimization"] },
  { name: "Growth", price: "3,999", features: ["Maps ranking boost", "Keyword targeting", "Lead tracking"] },
  { name: "Pro", price: "5,999", features: ["Website visibility", "WhatsApp leads", "Growth insights"] },
  { name: "Elite", price: "7,999", features: ["AI optimization", "Competitor tracking", "Advanced analytics"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white/70 backdrop-blur sticky top-0 z-50">
        <Image src="/dapc-logo.jpg" alt="DAPC" width={120} height={40} />
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold hover:text-blue-700">Login</button>
            </SignInButton>
            <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-5 py-2 rounded-lg text-sm font-bold">
              Get Started
            </button>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6">
          Your Business Is Losing Customers Online.
          <br />
          <span className="text-blue-700">We Show You Why.</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          DAPC scans Google, Maps, and search visibility to reveal missed leads, rankings, and growth opportunities instantly.
        </p>

        <div className="flex justify-center gap-6 text-xs text-slate-400 mb-10">
          <span>✔ Real-time audit</span>
          <span>✔ Nairobi-ready</span>
          <span>✔ No signup</span>
        </div>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border mb-12">
          <input placeholder="Enter your business name..." className="flex-1 px-4 py-3 outline-none" />
          <button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <SearchIcon size={18} /> Audit
          </button>
        </div>

        {/* FAKE DASHBOARD */}
        <div className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-xl text-left">
          <p className="text-xs text-slate-400 mb-2">Live Preview</p>
          <p className="text-lg font-bold">Visibility Score: <span className="text-red-500">38/100</span></p>
          <p className="text-sm text-slate-500">Google Rank: #21</p>
          <p className="text-sm text-slate-500">Missed Leads: 90/month</p>
          <p className="text-sm text-blue-700 font-semibold mt-2">Priority: HIGH</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 text-center">
        {["Search your business", "We analyze visibility", "Get growth plan"].map((step, i) => (
          <div key={i}>
            <div className="text-3xl font-black text-blue-700 mb-4">0{i + 1}</div>
            <p className="font-semibold">{step}</p>
          </div>
        ))}
      </section>

      {/* VALUE SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-black mb-6">Turn Visibility Into Revenue</h2>
          <p className="text-slate-500 mb-6">
            Businesses lose customers daily due to poor search visibility. DAPC shows exactly where you’re losing money — and how to fix it.
          </p>
          <ul className="space-y-3">
            {["Rank higher on Google", "Get more calls & WhatsApp leads", "Track competitors"].map((f, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <Check className="text-blue-600" size={16} /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border rounded-2xl p-8 shadow-lg">
          <p className="text-sm text-slate-400 mb-2">Example Insight</p>
          <p className="font-bold">You are ranking below 17 competitors</p>
          <p className="text-sm text-slate-500">Fix your Google Business profile & keyword gaps</p>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {pricingPlans.map((plan, i) => (
            <div key={i} className="bg-white border rounded-2xl p-6 flex flex-col hover:shadow-xl transition">
              <h3 className="font-bold mb-2">{plan.name}</h3>
              <p className="text-2xl font-black text-blue-700 mb-4">KES {plan.price}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="text-sm flex gap-2">
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
