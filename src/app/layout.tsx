// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAPC Visibility Tracker",
  description: "Track your business visibility online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <WhatsAppButton
            phoneNumber="254722973020"
            position="right"
            bottomOffset={20}
            message="Hello! I need assistance with the Visibility Tracker. Can you help me?"
            showTooltip={true}
            tooltipText="Need help? Chat with us on WhatsApp 💬"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}