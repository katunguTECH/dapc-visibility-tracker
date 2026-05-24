import { NextResponse } from "next/server";

// ⚠️ Store this in environment variables in production!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Nairobi123!";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === ADMIN_PASSWORD) {
    // Set a secure HTTP‑only cookie valid for 24 hours
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}