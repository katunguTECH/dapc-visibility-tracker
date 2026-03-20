import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Kenya Market Visibility Intelligence",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* The body is where Clerk attaches its listeners */}
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}