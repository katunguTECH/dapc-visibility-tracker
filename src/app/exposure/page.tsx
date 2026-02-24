"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";

export default function ExposurePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/exposure");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!data) return <AppLayout>Loading...</AppLayout>;

  const { local, global } = data;

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">Local & Global Exposure</h1>
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Local Visibility</h2>
          <ul className="list-disc list-inside mt-2">
            <li>Local searches: {local.searches}</li>
            <li>Google Maps impressions: {local.impressions}</li>
            <li>Direction requests: {local.directionRequests}</li>
            <li>Calls from Google: {local.callsFromGoogle}</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Global Visibility</h2>
          <ul className="list-disc list-inside mt-2">
            {global.visitors.map((v: any) => (
              <li key={v.country}>
                {v.country}: {v.count} visitors
              </li>
            ))}
            <li>Total global impressions: {global.impressions}</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}