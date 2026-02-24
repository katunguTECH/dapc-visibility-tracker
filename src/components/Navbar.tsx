"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Eye, Users, Zap } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Exposure", href: "/exposure", icon: Eye },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Action Center", href: "/actions", icon: Zap },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="font-bold text-xl text-blue-600">DAPC</div>

        <div className="flex gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}