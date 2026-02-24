function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function ScoreBreakdown() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Score Breakdown
      </h3>

      <ScoreBar label="Local Search Visibility" value={70} />
      <ScoreBar label="Google Maps Strength" value={55} />
      <ScoreBar label="Website SEO Health" value={65} />
      <ScoreBar label="Online Reputation" value={80} />
      <ScoreBar label="GEO (AI Readiness)" value={50} />
    </div>
  );
}