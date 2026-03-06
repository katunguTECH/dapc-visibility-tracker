// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        borderBottom: "1px solid #eee",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: "18px" }}>
        <Link href="/">DAPC</Link>
      </div>

      {/* Navigation Links */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link href="/">Home</Link>
        <Link href="/exposure">Exposure</Link>
        <Link href="/leads">Leads</Link>

        {/* Signed out users */}
        <SignedOut>
          <Link href="/sign-in">Sign In</Link>
        </SignedOut>

        {/* Signed in users */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}