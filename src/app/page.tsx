import BusinessSearch from "@/components/BusinessSearch";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-blue-600 tracking-tighter">DAPC.</span>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/exposure" className="hover:text-blue-600 transition-colors">Exposure</Link>
              <Link href="/leads" className="hover:text-blue-600 transition-colors">Leads</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Enterprise</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                  Log in
                </button>
              </SignInButton>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                Get Started
              </button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              REAL-TIME ANALYTICS ACROSS KENYA
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Dominate the <br />
              <span className="text-blue-600">Kenyan digital market.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              DAPC Visibility Tracker analyzes your business footprint across Google, social media, 
              and local directories to give you a competitive edge in <strong>every county across Kenya.</strong>
            </p>
          </div>

          {/* Analysis Tool Container */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-8">
               <BusinessSearch />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">
              Powering Business Intelligence in East Africa
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">01</div>
                <h3 className="font-bold text-slate-900">National Reach</h3>
                <p className="text-slate-500 text-sm">Compare rankings across Nairobi, Mombasa, Kisumu, and beyond.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">02</div>
                <h3 className="font-bold text-slate-900">AI Deep-Scan</h3>
                <p className="text-slate-500 text-sm">Our AI detects missing citations that are costing you customers.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold">03</div>
                <h3 className="font-bold text-slate-900">Competitor Gaps</h3>
                <p className="text-slate-500 text-sm">Identify exactly how many reviews you need to rank #1 in Kenya.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}