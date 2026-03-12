"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center">
          <Image
            src="/dapc-logo.jpg"
            alt="DAPC"
            width={180}
            height={60}
            priority
          />
        </Link>

        <nav className="flex gap-8 font-semibold text-sm">
          <Link href="/">Home</Link>
          <Link href="/exposure">Exposure</Link>
          <Link href="/leads">Leads</Link>
        </nav>

        <Link
          href="/signin"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Sign In
        </Link>

      </div>

    </header>
  );
}