import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4">
        {/* The component that handles all sign-in logic */}
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
            },
          }}
          // Redirect users to the dashboard after successful login
          forceRedirectUrl="/dashboard" 
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}