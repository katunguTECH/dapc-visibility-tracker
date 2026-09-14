import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// Two areas, two passwords. Kept as plaintext env vars for now per request —
// rotate these later and consider hashing if this ever needs to be stronger.
const PASSWORDS: Record<string, string | undefined> = {
  reports: process.env.ADMIN_PASSWORD,   // currently "Nairobi123!"
  leads: process.env.LEADS_PASSWORD,     // currently "Work@2026"
};

const COOKIES: Record<string, string> = {
  reports: "admin_authenticated",
  leads: "leads_authenticated",
};

// Very simple in-memory rate limit to slow down password guessing.
// Resets on deploy/restart and is per-server-instance, so it's not a
// substitute for a real rate limiter (e.g. Redis/Upstash) behind a
// multi-instance deployment — swap this out if you scale past one instance.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

// Constant-time string compare so a failed check can't leak timing info
// about how many leading characters matched.
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal length so the early return above
    // doesn't itself become a distinguishing timing signal.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const { password, area } = await req.json();

  if (area !== "reports" && area !== "leads") {
    return NextResponse.json({ error: "Invalid area" }, { status: 400 });
  }

  const expected = PASSWORDS[area];
  if (!expected) {
    console.error(`Password for area "${area}" is not set in the environment.`);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`${area}:${ip}`)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  if (typeof password === "string" && safeCompare(password, expected)) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIES[area], "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
