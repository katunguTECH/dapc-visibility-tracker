import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css"; // Ensure this path is 100% correct relative to this file

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Kenya Market Intelligence Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className="antialiased min-h-screen bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}