"use client"
// 1. Add useAuth from Clerk
import { useAuth } from "@clerk/nextjs" 
import { useRouter } from "next/navigation"

// ... inside your BusinessSearch component ...
const { isSignedIn } = useAuth()
const router = useRouter()

// ... down in the JSX for the Find Leads button ...
<button
  onClick={() => {
    if (!isSignedIn) {
      // If not signed in, send to sign-up. 
      // After sign-up, Clerk will automatically redirect them to /leads
      router.push("/sign-up?redirect_url=/leads")
    } else {
      // If they are signed in, take them straight to the leads/subscription page
      router.push(`/leads?business=${encodeURIComponent(business)}`)
    }
  }}
  className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
>
  Find Leads for {business}
</button>