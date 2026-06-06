import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory rate limiting (per V8 isolate)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests/min limit for sensitive endpoints

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requestInfo = ipRequestCounts.get(ip);

  if (!requestInfo || now > requestInfo.resetTime) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  requestInfo.count++;
  if (requestInfo.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // Admin routing protection checks
  const isAdminDashboard = url.pathname.startsWith("/admin/dashboard");
  const isAdminLogin = url.pathname === "/admin";
  const adminSession = request.cookies.get("aethex_admin_session")?.value;

  if (isAdminDashboard && !adminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminLogin && adminSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 1. IP-Based Rate Limiting for sensitive endpoints
  const isSensitiveRoute =
    url.pathname.startsWith("/api/order") ||
    url.pathname.startsWith("/api/checkout") ||
    url.pathname.startsWith("/admin");

  if (isSensitiveRoute) {
    const clientIp =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // 2. CSRF Protection for POST requests
  if (request.method === "POST" && isSensitiveRoute) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host");

    const expectedOrigin = `https://${host}`;
    const expectedOriginHttp = `http://${host}`;

    const isOriginValid =
      origin === expectedOrigin ||
      origin === expectedOriginHttp ||
      (referer && (referer.startsWith(expectedOrigin) || referer.startsWith(expectedOriginHttp)));

    if (!isOriginValid && process.env.NODE_ENV === "production") {
      return new NextResponse(
        JSON.stringify({ error: "CSRF verification failed." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // 3. Security Headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' https: data:;
    connect-src 'self' https://*.supabase.co https://api.payhere.lk https://challenges.cloudflare.com;
    frame-src 'self' https://challenges.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
