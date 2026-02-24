"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Exposure", href: "/exposure" },
    { name: "Leads", href: "/leads" },
    { name: "Action Center", href: "/actions" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-black text-white px-4 py-3 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="font-bold text-lg">DAPC Visibility</h1>

          <div className="flex gap-2 text-xs sm:text-sm overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-1 rounded-md transition ${
                  pathname === item.href
                    ? "bg-white text-black font-semibold"
                    : "hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}