"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts"

const data = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 70 },
  { month: "May", score: 83 },
  { month: "Jun", score: 92 },
]

export default function GrowthChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Visibility Growth</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X and Y axes */}
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
            labelStyle={{ fontWeight: 600 }}
          />

          {/* Optional Legend */}
          {/* <Legend verticalAlign="top" height={36} /> */}

          {/* Line */}
          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
            animationDuration={1500}
          >
            <LabelList dataKey="score" position="top" style={{ fontSize: 12, fill: "#2563eb", fontWeight: 600 }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}