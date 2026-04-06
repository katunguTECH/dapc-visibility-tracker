import Image from "next/image";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check } from "lucide-react";
import MpesaModal from "../components/MpesaModal";

const pricingPlans = [
  {
    name: "Starter Listing",
    icon: "/icons/starter-cheetah.jpg",
    price: "1,999",
    tagline: "For small or offline businesses",
    features: ["Proper setup & visibility", "Visibility Score", "Foundation for search"],
  },
  {
    name: "Local Boost",
    icon: "/icons/boost-buffalo.jpg",
    price: "3,999",
    tagline: "For businesses wanting more walk-ins",
    features: ["Google Maps optimization", "Target search terms", "Track customer actions"],
  },
  {
    name: "Growth Engine",
    icon: "/icons/growthengine-rhino.jpg",
    price: "5,999",
    tagline: "For businesses ready for monthly leads",
    features: ["Website visibility improvement", "Track WhatsApp inquiries", "Predictable inquiries"],
  },
  {
    name: "Market Leader",
    icon: "/icons/marketleader-elephant.jpg",
    price: "7,999",
    tagline: "For businesses in competitive industries",
    features: ["AI-driven search optimization", "Competitor comparisons", "Advanced performance tracking"],
  },
  {
    name: "Super Active Visibility",
    icon: "/icons/superactivevisibility-lion.jpg",
    price: "10,000",
    tagline: "For ambitious brands seeking maximum exposure",
    features: ["National & International optimization", "Priority optimization", "Clear monthly performance insights"],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Image 
            src="/dapc-logo.jpg" 
            alt="DAPC Logo" 
            width={180} 
            height={50} 
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold hover:text-blue-700 transition">Login</button>
            </SignInButton>
            <button className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition">
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-slate-50">
        <h2 className="text-blue-700 font-bold uppercase tracking-widest text-sm mb-4">Kenya Market Intelligence</h2>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
          Is Your Business <br/> <span className="text-blue-700">Visible Online?</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Audit your digital footprint across Nairobi instantly.
        </p>
        
        <div className="max-w-xl mx-auto flex gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-200">
          <input 
            type="text" 
            placeholder="Enter Business Name..." 
            className="flex-1 px-4 py-3 outline-none text-slate-800"
          />
          <button className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition">
            Run Free Audit
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Monthly Rates</h2>
          <div className="w-20 h-1 bg-blue-700 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col hover:border-blue-300 hover:shadow-2xl transition-all group">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Image 
                  src={plan.icon} 
                  alt={plan.name} 
                  fill 
                  className="rounded-full object-cover border-4 border-slate-50 group-hover:border-blue-100 transition-colors"
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight leading-none mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-medium h-8">{plan.tagline}</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-xs font-bold text-slate-400 uppercase">KES</span>
                <span className="text-3xl font-black text-blue-700 mx-1">{plan.price}</span>
                <span className="text-xs font-semibold text-slate-500">/mo</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex gap-3 text-sm text-slate-600 leading-tight">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <MpesaModal 
                amount={plan.price.replace(',', '')} 
                planName={plan.name}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50 px-8 text-center">
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