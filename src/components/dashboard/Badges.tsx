export default function Badges() {
  const badges = [
    { name: "Local Starter", emoji: "🥉", description: "Listed correctly online" },
    { name: "Search Climber", emoji: "🥈", description: "Ranking improvements seen" },
    { name: "Visibility Leader", emoji: "🥇", description: "Strong local presence" },
    { name: "Global Ready", emoji: "🌍", description: "Receiving international traffic" },
    { name: "AI Discoverable", emoji: "🤖", description: "Optimized for GEO" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Progress & Growth Badges</h3>
      <div className="flex flex-wrap gap-4">
        {badges.map((badge) => (
          <div
            key={badge.name}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg w-32"
          >
            <span className="text-2xl">{badge.emoji}</span>
            <span className="font-semibold mt-2 text-center">{badge.name}</span>
            <span className="text-xs text-gray-500 text-center">{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}