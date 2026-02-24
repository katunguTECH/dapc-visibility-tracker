import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Charts() {
  const data = [
    { month: "Sep", visibility: 45 },
    { month: "Oct", visibility: 50 },
    { month: "Nov", visibility: 55 },
    { month: "Dec", visibility: 60 },
    { month: "Jan", visibility: 62 },
    { month: "Feb", visibility: 65 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Online Visibility Growth (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="visibility" stroke="#1e40af" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}