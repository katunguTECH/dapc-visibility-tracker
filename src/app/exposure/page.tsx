import BusinessSearch from "@/components/BusinessSearch";
import ComparisonChart from "@/components/ComparisonChart";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ExposurePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetching the last search or business data from your database
  const businessData = await prisma.business.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { competitors: true }
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Visibility Exposure Analysis</h1>
          <p className="text-slate-500 mt-2">Compare your digital footprint against local market leaders.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Search & Quick Actions */}
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">New Analysis</h2>
              <BusinessSearch />
            </section>

            <section className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-3">Growth Strategy</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  DAPC currently holds a <strong>4.7 rating</strong>. By increasing your review volume to 210, 
                  your Visibility Score is projected to surpass the "Market Leader" by Q3.
                </p>
                <button className="mt-6 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                  Generate Full Report
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
            </section>
          </div>

          {/* Right Column: Visualization & Comparison */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <ComparisonChart />
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Competitive Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4">Business</th>
                      <th className="px-6 py-4 text-center">Rating</th>
                      <th className="px-6 py-4 text-center">Reviews</th>
                      <th className="px-6 py-4 text-right">Visibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* DAPC Row */}
                    <tr className="bg-blue-50/30">
                      <td className="px-6 py-4 font-bold text-slate-900">DAPC (You)</td>
                      <td className="px-6 py-4 text-center text-blue-600 font-bold">4.7</td>
                      <td className="px-6 py-4 text-center">150</td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">78%</span>
                      </td>
                    </tr>
                    {/* Competitor Rows */}
                    <tr>
                      <td className="px-6 py-4 text-slate-600">Top Ranked Competitor</td>
                      <td className="px-6 py-4 text-center">4.8</td>
                      <td className="px-6 py-4 text-center text-slate-500">342</td>
                      <td className="px-6 py-4 text-right font-semibold">92%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-slate-600">Local Market Leader</td>
                      <td className="px-6 py-4 text-center">4.6</td>
                      <td className="px-6 py-4 text-center text-slate-500">210</td>
                      <td className="px-6 py-4 text-right font-semibold">85%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}