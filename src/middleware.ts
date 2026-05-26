import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_COUNTRIES = ["US", "IN", "PK"];

// Only the canonical host should serve content; the apex domain
// (and any www-less variant) is permanently redirected to it so that
// both creeklend.com and www.creeklend.com resolve to one indexable URL.
const CANONICAL_HOST = "www.creeklend.com";
const APEX_HOST = "creeklend.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // Redirect the bare apex domain to the canonical www host, preserving
  // the path and query string. Preview (*.vercel.app) and localhost hosts
  // are left untouched so they keep working independently.
  if (host === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  // Apply geo-blocking to the apply route and specific API routes
  if (
    request.nextUrl.pathname.startsWith("/apply") ||
    request.nextUrl.pathname.startsWith("/api/bank-verification")
  ) {
    // Vercel and Cloudflare provide geo headers
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "";

    // If we have geo data and the country is not allowed, block
    if (country && !ALLOWED_COUNTRIES.includes(country)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("geo", "blocked");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request except Next.js internals and static assets so the
  // apex→www redirect covers all pages, while geo-blocking still applies to
  // its specific routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
