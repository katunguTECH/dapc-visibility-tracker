import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Two separate protected areas, each with its own password/cookie.
// "reports" = admin dashboard, "leads" = the prospects/site-generator leads.
const AREAS = [
  {
    name: "reports",
    cookie: "admin_authenticated",
    pagePaths: ["/admin-reports", "/admin/reports"],
    apiPaths: [] as string[],
  },
  {
    name: "leads",
    cookie: "leads_authenticated",
    pagePaths: ["/prospects"],
    apiPaths: ["/api/leads"],
  },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const area of AREAS) {
    const isPage = area.pagePaths.some((p) => pathname.startsWith(p));
    const isApi = area.apiPaths.some((p) => pathname.startsWith(p));

    if (!isPage && !isApi) continue;

    const isAuthenticated = request.cookies.get(area.cookie)?.value === "true";
    if (isAuthenticated) return NextResponse.next();

    // For API calls, return 401 JSON instead of a redirect — a redirect
    // would just send fetch() a 3xx it can't follow into a login page.
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    loginUrl.searchParams.set("area", area.name);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-reports",
    "/admin/reports/:path*",
    "/prospects/:path*",
    "/api/leads/:path*",
  ],
};
