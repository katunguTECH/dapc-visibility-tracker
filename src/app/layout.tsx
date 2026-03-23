import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAPC | Stop Guessing Your Digital Impact",
  description: "Kenya's #1 Market Intelligence Engine. Audit your business visibility and find growth leads in seconds.",
  keywords: ["Digital Audit", "Nairobi Business", "Market Intelligence", "Kenya SEO", "Visibility Tracker"],
  authors: [{ name: "DAPC Team" }],
  
  // This section fixes the WhatsApp/Social Media Preview
  openGraph: {
    title: "DAPC Visibility Tracker",
    description: "Audit your business visibility. Chat with us on WhatsApp: +254 710 444 0648",
    url: "https://dapc.co.ke",
    siteName: "DAPC Kenya",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "https://dapc.co.ke/og-image.jpg", // Ensure you have this image in your /public folder
        width: 1200,
        height: 630,
        alt: "DAPC Market Intelligence Dashboard",
      },
    ],
  },

  // Twitter/X Preview Logic
  twitter: {
    card: "summary_large_image",
    title: "DAPC | Digital Impact Auditor",
    description: "Real-time Kenyan market intelligence for businesses.",
    images: ["https://dapc.co.ke/og-image.jpg"],
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
        {/* Force WhatsApp to see the new number */}
        <link rel="canonical" href="https://dapc.co.ke" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}