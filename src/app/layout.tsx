// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // If you call auth() or headers() here, you must await them
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}