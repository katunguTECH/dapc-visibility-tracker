"use client"

function ScoreBar({ label, value }: { label: string; value: number }) {
  const getColor = () => {
    if (value >= 75) return "bg-green-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-semibold text-gray-800">{value}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`${getColor()} h-3 rounded-full transition-all duration-700 ease-in-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function ScoreBreakdown() {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 sm:p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Score Breakdown
        </h3>
        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          Updated Monthly
        </span>
      </div>

      <ScoreBar label="Local Search Visibility" value={70} />
      <ScoreBar label="Google Maps Strength" value={55} />
      <ScoreBar label="Website SEO Health" value={65} />
      <ScoreBar label="Online Reputation" value={80} />
      <ScoreBar label="GEO (AI Readiness)" value={50} />
    </div>
  )
}