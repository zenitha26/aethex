import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

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

export async function middleware(request: NextRequest) {
  // 1. Supabase Session Validation
  const { supabaseResponse, user } = await updateSession(request);
  const response = supabaseResponse;

  const url = request.nextUrl;

  // 2. Customer Routing Protection
  const isAccountRoute = url.pathname.startsWith("/account");
  const isCheckoutRoute = url.pathname.startsWith("/checkout");
  const isAuthRoute = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");

  if ((isAccountRoute || isCheckoutRoute) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // 3. Admin routing protection checks
  const isAdminRoute = url.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    // Check if the user has the 'admin' role in profiles
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseResponse.headers.get('Authorization') || request.cookies.get('sb-access-token') || ''}`,
            },
          }
        );
        const profiles = await profileRes.json();
        
        if (!profiles || !profiles.length || profiles[0].role !== 'admin') {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (err) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 4. API Security Check
  const isApiAdminRoute = url.pathname.startsWith("/api/admin");
  if (isApiAdminRoute) {
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const profileRes = await fetch(
          `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=role`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseResponse.headers.get('Authorization') || request.cookies.get('sb-access-token') || ''}`,
            },
          }
        );
        const profiles = await profileRes.json();
        
        if (!profiles || !profiles.length || profiles[0].role !== 'admin') {
          return new NextResponse(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
      } catch (err) {
        return new NextResponse(JSON.stringify({ error: "Server error verifying role" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    } else {
      return new NextResponse(JSON.stringify({ error: "Configuration missing" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
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
