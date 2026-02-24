export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Leads Generated</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Calls</p>
          <h2 className="text-2xl font-bold text-blue-600">46</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">WhatsApp Clicks</p>
          <h2 className="text-2xl font-bold text-green-600">33</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Website Form Inquiries</p>
          <h2 className="text-2xl font-bold text-purple-600">18</h2>
        </div>
      </div>
    </div>
  )
}