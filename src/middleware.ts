import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require admin authentication
const adminPaths = ["/admin-reports", "/admin/reports"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (adminPaths.some((p) => pathname.startsWith(p))) {
    const isAuthenticated = request.cookies.get("admin_authenticated")?.value === "true";
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-reports", "/admin/reports/:path*"],
};