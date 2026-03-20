import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          {/* Ensure this is outside of any logic that might be server-side only */}
          <WhatsAppButton />
        </body>
      </html>
    </ClerkProvider>
  )
}