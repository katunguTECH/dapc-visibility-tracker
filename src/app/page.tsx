"use client"

import Navbar from "@/components/Navbar"
import BusinessSearch from "@/components/BusinessSearch"

export default function Home() {

  return (

    <main className="min-h-screen bg-white">

      <Navbar />

      <section className="py-16 px-6">

        <div className="max-w-5xl mx-auto">

          <BusinessSearch />

        </div>

      </section>

    </main>

  )

}