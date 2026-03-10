import BusinessSearch from "@/components/BusinessSearch";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="absolute top-4 right-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center text-slate-900">
          DAPC Visibility Tracker
        </h1>
        
        <p className="text-center text-slate-600 max-w-2xl text-lg">
          Track and analyze your business visibility across digital platforms. 
          Search for your business below to get started.
        </p>

        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <BusinessSearch />
        </div>

        <SignedIn>
          <div className="flex gap-4">
            <Link 
              href="/exposure" 
              className="text-blue-600 hover:underline font-semibold"
            >
              View Exposure Dashboard →
            </Link>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}