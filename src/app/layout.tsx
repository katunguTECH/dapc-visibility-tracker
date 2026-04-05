import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Kenya Market Intelligence Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {/* Optionally wrap children with SignedIn / SignedOut UI */}
          <SignedIn>{children}</SignedIn>
          <SignedOut>{children}</SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}