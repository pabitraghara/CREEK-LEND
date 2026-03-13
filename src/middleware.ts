import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_COUNTRIES = ["US", "IN"];

export function middleware(request: NextRequest) {
  // Only apply geo-blocking to the apply route and API
  if (request.nextUrl.pathname.startsWith("/apply")) {
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
  matcher: ["/apply/:path*"],
};
