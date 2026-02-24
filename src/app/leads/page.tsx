"use client";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";

export default function LeadsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/leads");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!data) return <AppLayout>Loading...</AppLayout>;

  const { phoneCalls, websiteForms, whatsappClicks, bookings, directions } = data;

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold mb-6">Leads & Customer Actions</h1>
      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Phone Calls</h2>
          <p>{phoneCalls}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Website & WhatsApp Leads</h2>
          <p>Website forms: {websiteForms}</p>
          <p>WhatsApp clicks: {whatsappClicks}</p>
          <p>Bookings: {bookings}</p>
          <p>Directions: {directions}</p>
        </div>
      </div>
    </AppLayout>
  );
}