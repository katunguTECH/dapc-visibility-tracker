"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function MarketShareChart({
  userScore,
  leaderScore,
}: {
  userScore: number;
  leaderScore: number;
}) {
  const data = [
    { name: "Your Visibility", value: userScore },
    { name: "Competitor Visibility", value: leaderScore },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label
        >
          <Cell />
          <Cell />
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}