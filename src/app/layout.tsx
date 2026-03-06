// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "AI Business Visibility SaaS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#f5f7fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <ClerkProvider>
          {/* Global Navbar */}
          <Navbar />

          {/* Page Content */}
          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}