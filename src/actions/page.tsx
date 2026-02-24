export default function ActionsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Action Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Google Profile Updates</p>
          <h2 className="text-2xl font-bold text-blue-600">In Progress</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Keyword Optimization</p>
          <h2 className="text-2xl font-bold text-green-600">Completed</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
          <p className="text-gray-500 text-sm">Reviews & Reputation</p>
          <h2 className="text-2xl font-bold text-purple-600">Ongoing</h2>
        </div>
      </div>
    </div>
  )
}