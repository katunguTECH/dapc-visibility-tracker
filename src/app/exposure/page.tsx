export default function ExposurePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Exposure Metrics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Local Search Impressions</p>
          <h2 className="text-2xl font-bold text-blue-600">1,248</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Direction Requests</p>
          <h2 className="text-2xl font-bold text-green-600">312</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Website Visits</p>
          <h2 className="text-2xl font-bold text-purple-600">4,560</h2>
        </div>
      </div>
    </div>
  )
}