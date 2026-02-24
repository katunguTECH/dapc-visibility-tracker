import { NextResponse } from "next/server";

// Example: replace with real Twilio / Forms API later
export async function GET() {
  const data = {
    phoneCalls: 46,
    websiteForms: 23,
    whatsappClicks: 12,
    bookings: 7,
    directions: 120,
  };

  return NextResponse.json(data);
}