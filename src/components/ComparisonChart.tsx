"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function ComparisonChart() {

  const data = [
    { name: "You", score: 76 },
    { name: "Leader", score: 94 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="score" />
      </BarChart>
    </ResponsiveContainer>
  );
}