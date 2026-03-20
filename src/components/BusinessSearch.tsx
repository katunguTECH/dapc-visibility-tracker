"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ... inside your component ...
const { isSignedIn } = useAuth();
const router = useRouter();

// ... find your "Find Leads" button ...
<button
  onClick={() => {
    if (!isSignedIn) {
      // Redirect to sign up, then it will bring them back to /leads
      router.push("/sign-up?redirect_url=/leads");
    } else {
      // If signed in, take them to the billing/leads page
      router.push("/leads");
    }
  }}
  className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg"
>
  Find Leads for {business}
</button>