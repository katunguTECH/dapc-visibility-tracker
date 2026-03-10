import BusinessSearch from "@/components/BusinessSearch";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black text-blue-600 tracking-tighter uppercase italic">DAPC</span>
            <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/exposure" className="hover:text-blue-600 transition-colors">Exposure</Link>
              <Link href="/leads" className="hover:text-blue-600 transition-colors">Leads</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Enterprise</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">Log in</button>
              </SignInButton>
              <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">Get Started</button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              NATIONAL MARKET INTELLIGENCE
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Scale your visibility <br />
              <span className="text-blue-600 text-4xl md:text-5xl">across the Kenyan Market.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              DAPC uses AI to audit your business footprint and compare it against 
              competitors in <strong>any Kenyan county.</strong>
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-4 md:p-8">
               <BusinessSearch />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}