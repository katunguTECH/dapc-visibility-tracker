"use client"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ... inside your component ...
const { isSignedIn } = useAuth();
const router = useRouter();

// ... find your "Find Leads" button and update the onClick ...
<button
  onClick={() => {
    if (!isSignedIn) {
      // Directs to Sign Up, and Clerk handles the redirect after successful registration
      router.push("/sign-up?redirect_url=/subscribe");
    } else {
      // If already signed in, go straight to the subscription page
      router.push("/subscribe");
    }
  }}
  className="w-full bg-emerald-600 text-white p-4 rounded-xl text-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg"
>
  Find Leads for {business}
</button>