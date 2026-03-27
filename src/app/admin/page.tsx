import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  // RESTRICTION: Only your Clerk ID can access this
  // Replace 'user_your_id' with your actual Clerk User ID from the dashboard
  const ADMIN_ID = "user_2u..."; 
  if (userId !== ADMIN_ID) {
    redirect("/");
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: "ACTIVE" }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 style={{ fontWeight: 900 }} className="text-4xl text-slate-950 mb-8 uppercase tracking-tighter">
          DAPC <span className="text-blue-600">Command Center</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Active Subscribers</p>
            <p className="text-5xl font-black text-slate-900">{activeSubscriptions}</p>
          </div>
          {/* Add more stats like Total Revenue here */}
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-white text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="p-6">Date</th>
                <th className="p-6">Phone</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
                <th className="p-6">Receipt</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                  <td className="p-6">{format(new Date(tx.createdAt), "MMM d, HH:mm")}</td>
                  <td className="p-6">{tx.phoneNumber}</td>
                  <td className="p-6">KES {tx.amount}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase ${
                      tx.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-6 font-mono text-xs">{tx.mpesaReceipt || "---"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}