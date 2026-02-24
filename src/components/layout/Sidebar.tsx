import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">DAPC</h2>

      <nav className="space-y-4 flex flex-col">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/exposure">Exposure</Link>
        <Link href="/leads">Leads</Link>
        <Link href="/actions">Action Center</Link>
        <Link href="/recommendations">Recommendations</Link>
      </nav>
    </div>
  );
}