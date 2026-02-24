export default function VisibilityScoreCard() {
  const score = 62;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">
          DAPC Visibility Score
        </h2>
        <p className="text-4xl font-bold text-blue-900 mt-2">
          {score}/100
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Improving steadily this month 🚀
        </p>
      </div>

      <div className="w-24 h-24 rounded-full border-8 border-blue-600 flex items-center justify-center">
        <span className="text-xl font-bold text-blue-900">
          {score}%
        </span>
      </div>
    </div>
  );
}