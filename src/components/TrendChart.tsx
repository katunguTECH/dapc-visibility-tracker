"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart() {

  const data = [
    { month: "Jan", score: 58 },
    { month: "Feb", score: 62 },
    { month: "Mar", score: 66 },
    { month: "Apr", score: 70 },
    { month: "May", score: 74 },
    { month: "Jun", score: 76 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <Tooltip />
        <Line dataKey="score" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}