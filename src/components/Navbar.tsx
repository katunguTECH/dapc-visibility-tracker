"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Eye, Users, Zap } from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Exposure", href: "/exposure", icon: Eye },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Action Center", href: "/actions", icon: Zap },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto no-scrollbar gap-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
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