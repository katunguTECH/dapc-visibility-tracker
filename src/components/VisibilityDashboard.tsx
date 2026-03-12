"use client";

export default function VisibilityDashboard({ data }: any) {

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold">
        Visibility Results
      </h2>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-slate-500">Visibility Score</p>
          <p className="text-4xl font-bold">{data.visibilityScore}%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-slate-500">Google Ranking</p>

          <p className="text-4xl font-bold">
            {data.rankingPosition === -1
              ? "Not Found"
              : `#${data.rankingPosition + 1}`}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-slate-500">Customer Rating</p>
          <p className="text-4xl font-bold">{data.rating} ★</p>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-4">
          Competitors Ranking
        </h3>

        <ul className="space-y-2">

          {data.competitors?.map((c: any, i: number) => (
            <li key={i}>
              {i + 1}. {c.name}
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}