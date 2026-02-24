import GrowthChart from "@/components/GrowthChart"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Visibility Score</p>
          <h2 className="text-3xl font-bold text-blue-600">92</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Exposure Reach</p>
          <h2 className="text-3xl font-bold">14.2K</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Leads Generated</p>
          <h2 className="text-3xl font-bold text-green-600">128</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Conversion Rate</p>
          <h2 className="text-3xl font-bold text-purple-600">8.4%</h2>
        </div>
      </div>

      {/* Growth Chart */}
      <GrowthChart />
    </div>
  )
}