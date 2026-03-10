"use client";

import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function VisibilityGauge({ score }: { score: number }) {
  const data = [{ name: "Visibility", value: score }];

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
          />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="text-center -mt-20">
        <p className="text-4xl font-black">{score}%</p>
        <p className="text-slate-500 text-sm">Visibility Score</p>
      </div>
    </div>
  );
}