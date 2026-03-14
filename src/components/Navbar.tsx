import { headers } from "next/headers";

export default async function Navbar() {
  // Keeping the await to satisfy Next.js 15 requirements
  await headers(); 
  
  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
      <div className="text-2xl font-black text-blue-600 tracking-tighter">DAPC</div>
      <div className="hidden md:flex gap-8 text-slate-500 font-semibold text-sm uppercase tracking-wider">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Exposure</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Leads</a>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all">
          Sign In
        </button>
      </div>
    </nav>
  );
}