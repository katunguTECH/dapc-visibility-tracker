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
        {/* Adding 'suppressHydrationWarning' helps with the blank page issue 
            caused by browser extensions or Clerk's auth state shifts */}
        <body suppressHydrationWarning>{children}</body>
      </html>
    </ClerkProvider>
  )
}