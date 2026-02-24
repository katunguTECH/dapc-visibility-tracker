import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "DAPC Visibility Tracker",
  description: "Track your business visibility and leads",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}