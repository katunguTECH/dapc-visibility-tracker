import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs' // 1. Import Clerk

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dapc.co.ke'),
  title: "DAPC | Digital Impact & Visibility Auditor",
  description: "Kenya's real-time market intelligence engine. Audit your visibility and find growth leads. WhatsApp: +254 710 444 0648",
  openGraph: {
    title: "DAPC Visibility Tracker",
    description: "Audit your business visibility across Google and Social Media. Chat with us on WhatsApp: +254 710 444 0648",
    url: "https://www.dapc.co.ke",
    siteName: "DAPC Kenya",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg.svg",
        width: 1200,
        height: 630,
        alt: "DAPC Visibility Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAPC | Digital Impact Auditor",
    images: ["/og-image.jpg.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 2. Wrap everything in ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="canonical" href="https://www.dapc.co.ke" />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}