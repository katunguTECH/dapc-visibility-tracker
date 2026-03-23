import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. metadataBase fixes the image path issue seen in your screenshot
  metadataBase: new URL('https://www.dapc.co.ke'),
  
  title: "DAPC | Digital Impact & Visibility Auditor",
  description: "Kenya's real-time market intelligence engine. Audit your visibility and find growth leads. WhatsApp: +254 710 444 0648",
  keywords: ["Digital Audit", "Nairobi", "Kenya SEO", "Visibility Tracker", "Market Intelligence"],
  
  // 2. OpenGraph fix (for WhatsApp/Facebook)
  openGraph: {
    title: "DAPC Visibility Tracker",
    description: "Audit your business visibility across Google and Social Media. Chat with us on WhatsApp: +254 710 444 0648",
    url: "https://www.dapc.co.ke", // Use www to match your redirect path
    siteName: "DAPC Kenya",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // This looks for /public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "DAPC Visibility Dashboard",
      },
    ],
  },

  // 3. Twitter/X Preview
  twitter: {
    card: "summary_large_image",
    title: "DAPC | Digital Impact Auditor",
    description: "Real-time Kenyan market intelligence for local businesses.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Helps scrapers identify the primary version of your site */}
        <link rel="canonical" href="https://www.dapc.co.ke" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}