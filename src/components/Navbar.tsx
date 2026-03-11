"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/dapc-logo.jpg"
            alt="DAPC - Drive Africa Performance Center"
            width={160}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">

          <Link
            href="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            href="/exposure"
            className="hover:text-blue-600 transition"
          >
            Exposure
          </Link>

          <Link
            href="/leads"
            className="hover:text-blue-600 transition"
          >
            Leads
          </Link>

        </nav>

        {/* RIGHT SIDE BUTTON */}
        <div>
          <Link
            href="/signin"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>

      </div>
    </header>
  );
}