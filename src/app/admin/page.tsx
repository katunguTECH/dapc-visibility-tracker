import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Users, CreditCard, Activity, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  // SECURITY: Replace this string with your actual Clerk User ID
  // You can find this in the Clerk Dashboard under "Users"
  const ADMIN_ID = "user_2uK..."; 

  if (!userId || userId !== ADMIN_ID) {
    redirect("/");
  }

  // Fetch Data from Prisma Postgres
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" }
  });

  const totalRevenue = await prisma.transaction.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amount: true }
  });

  const totalLeads = await prisma.lead.count();

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors mb-4">
              <ArrowLeft size={14} /> Back to Site
            </Link>
            <h1 style={{ fontWeight: 900 }} className="text-4xl md:text-5xl text-slate-950 tracking-tighter uppercase">
              Command <span className="text-blue-600 italic">Center</span>
            </h1>
          </div>
          <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            Admin Live
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <Users className="text-blue-600 mb-6" size={32} />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Subscribers</p>
            <p className="text-5xl font-black text-slate-950 tracking-tighter">{activeSubscriptions}</p>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <CreditCard className="text-emerald-500 mb-6" size={32} />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Revenue</p>
            <p className="text-5xl font-black text-slate-950 tracking-tighter">
              <span className="text-xl text-slate-400 mr-1">KES</span>
              {totalRevenue._sum.amount?.toLocaleString() || 0}
            </p>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
            <Activity className="text-orange-500 mb-6" size={32} />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Market Leads</p>
            <p className="text-5xl font-black text-slate-950 tracking-tighter">{totalLeads}</p>
          </div>
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <div className="bg-white rounded-[45px] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <h3 style={{ fontWeight: 900 }} className="text-xl text-slate-900 uppercase tracking-tight">Recent Transactions</h3>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">Timestamp</th>
                  <th className="px-10 py-6">Phone Number</th>
                  <th className="px-10 py-6">Amount</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">M-Pesa Receipt</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-600">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-300 italic uppercase tracking-widest">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-10 py-8 text-slate-950">
                        {format(new Date(tx.createdAt), "dd MMM, HH:mm")}
                      </td>
                      <td className="px-10 py-8 font-mono">{tx.phoneNumber}</td>
                      <td className="px-10 py-8 text-slate-950">KES {tx.amount}</td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          tx.status === "COMPLETED" 
                            ? "bg-emerald-100 text-emerald-700" 
                            : tx.status === "FAILED" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-mono text-blue-600">
                        {tx.mpesaReceipt || "---"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}