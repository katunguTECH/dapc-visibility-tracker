"use client"

import Navbar from "@/components/Navbar"
import BusinessSearch from "@/components/BusinessSearch"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Stop Guessing Your <span className="text-blue-600">Digital Impact.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Get real-time Kenyan market intelligence. Audit your business visibility 
            across Google, Social Media, and local directories in seconds.
          </p>
          
          {/* Audit Component Container */}
          <div className="max-w-3xl mx-auto">
             <BusinessSearch />
          </div>
        </div>
      </section>

      {/* Trust/Feature Section */}
      <section className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-bold text-slate-900">Local Accuracy</h3>
            <p className="text-slate-500 text-sm">Tailored specifically for the Kenyan business landscape.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Competitor Insights</h3>
            <p className="text-slate-500 text-sm">See how you stack up against other players in your city.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Lead Generation</h3>
            <p className="text-slate-500 text-sm">Identify gaps and turn them into high-converting leads.</p>
          </div>
        </div>
      </section>
    </main>
  )
}