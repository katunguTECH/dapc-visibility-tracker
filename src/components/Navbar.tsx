"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  return (

    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-2">

          <Image
            src="/dapc-logo.jpg"
            alt="DAPC Logo"
            width={140}
            height={40}
          />

        </div>

        {/* Desktop Navigation */}

        <nav className="hidden md:flex gap-6 items-center">

          <Link href="/" className="font-medium hover:text-blue-600">
            Home
          </Link>

          <Link href="/exposure" className="font-medium hover:text-blue-600">
            Exposure
          </Link>

          <Link href="/leads" className="font-medium hover:text-blue-600">
            Leads
          </Link>

          <Link
            href="/sign-in"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>

        </nav>

        {/* Mobile Menu Button */}

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="md:hidden border-t bg-white">

          <div className="flex flex-col p-4 gap-4">

            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="/exposure" onClick={() => setMenuOpen(false)}>
              Exposure
            </Link>

            <Link href="/leads" onClick={() => setMenuOpen(false)}>
              Leads
            </Link>

            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Sign In
            </Link>

          </div>

        </div>

      )}

    </header>

  )

}