"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function CompetitorChart({ data }: any) {
  const chartData = data.map((c: any) => ({ name: c.name, score: c.seoScore }));

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Competitor SEO Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}