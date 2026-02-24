"use client";

import AppLayout from "@/components/layout/AppLayout";

export default function DashboardPage() {
  const visibilityScore = 78;

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Business Visibility Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Measure your growth. Track your exposure. See DAPC at work.
          </p>
        </div>

        {/* Visibility Score */}
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-lg font-semibold mb-3">
            Overall Visibility Score
          </h2>

          <div className="text-6xl font-bold text-green-600">
            {visibilityScore}%
          </div>

          <p className="text-gray-500 mt-3 text-sm">
            Your online presence performance this month.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <MetricCard
            title="Local Searches"
            value="1,248"
            change="+12%"
          />

          <MetricCard
            title="Google Calls"
            value="46"
            change="+8%"
          />

          <MetricCard
            title="Website Leads"
            value="23"
            change="+5%"
          />

          <MetricCard
            title="AI Search Readiness"
            value="Optimized"
            change="Active"
          />

        </div>
      </div>
    </AppLayout>
  );
}

function MetricCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>

      <div className="flex justify-between items-center mt-3">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="text-sm text-green-600 font-medium">
          {change}
        </span>
      </div>
    </div>
  );
}