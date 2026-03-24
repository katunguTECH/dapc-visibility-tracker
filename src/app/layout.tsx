// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css"; // ✅ only here

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Kenya Market Intelligence Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}