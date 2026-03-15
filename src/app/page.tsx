"use client"

import Image from "next/image"
import BusinessSearch from "@/components/BusinessSearch"
import { useState, useEffect } from "react"

export default function Home() {

  const [score, setScore] = useState(0)

  useEffect(() => {

    let start = 0

    const interval = setInterval(() => {

      start += 2
      setScore(start)

      if (start >= 100) clearInterval(interval)

    }, 20)

  }, [])

  return (

    <main className="min-h-screen bg-white">

      {/* STICKY NAVBAR */}

      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">

          <Image
            src="/dapc-logo.jpg"
            alt="DAPC Logo"
            width={200}
            height={60}
            priority
          />

        </div>

      </header>

      {/* HERO SECTION */}

      <section className="py-16 px-6">

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* SEARCH TOOL */}

          <div>

            <BusinessSearch />

          </div>

          {/* VISIBILITY GAUGE */}

          <div className="flex flex-col items-center">

            <div className="relative w-56 h-56">

              <svg className="transform -rotate-90 w-full h-full">

                <circle
                  cx="112"
                  cy="112"
                  r="90"
                  stroke="#e5e7eb"
                  strokeWidth="15"
                  fill="transparent"
                />

                <circle
                  cx="112"
                  cy="112"
                  r="90"
                  stroke="#2563eb"
                  strokeWidth="15"
                  fill="transparent"
                  strokeDasharray={565}
                  strokeDashoffset={565 - (565 * score) / 100}
                  strokeLinecap="round"
                />

              </svg>

              <div className="absolute inset-0 flex items-center justify-center">

                <span className="text-4xl font-bold text-gray-800">

                  {score}%

                </span>

              </div>

            </div>

            <p className="mt-6 text-gray-500 text-center max-w-xs">
              Business visibility score preview
            </p>

          </div>

        </div>

      </section>

    </main>

  )
}