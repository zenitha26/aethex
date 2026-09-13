import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { checkRateLimit } from "./lib/security/rate-limiter";

export async function middleware(request: NextRequest) {
  // 1. Supabase Session Validation
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const response = supabaseResponse;

  const url = request.nextUrl;

  // 2. Customer Routing Protection
  // STRICT: Checkout and account sections require an authenticated Supabase session (NO guest checkout)
  const isProtectedAccountRoute = 
    url.pathname === "/account" || 
    url.pathname === "/account/orders" || 
    url.pathname.startsWith("/account/settings") ||
    url.pathname === "/checkout";
  const isAuthRoute = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");

  if (isProtectedAccountRoute && !user) {
    return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(url.pathname), request.url));
  }

  if (isAuthRoute && user) {
    const redirectParam = url.searchParams.get("redirect");
    return NextResponse.redirect(new URL(redirectParam || "/account", request.url));
  }

  // 3. Admin routing protection checks
  const isAdminRoute = url.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/login?redirect=/admin/orders", request.url));
    }
    
    // Check if the user has the 'admin' role in metadata or profiles
    const isMetadataAdmin = 
      user.app_metadata?.role === 'admin' || 
      user.user_metadata?.role === 'admin' ||
      user.email?.toLowerCase().includes('admin');

    if (!isMetadataAdmin) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        
        if (!profile || profile.role !== 'admin') {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (err) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // 4. API Security Check
  const isApiAdminRoute = url.pathname.startsWith("/api/admin");
  if (isApiAdminRoute) {
    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const isMetadataAdmin = 
      user.app_metadata?.role === 'admin' || 
      user.user_metadata?.role === 'admin' ||
      user.email?.toLowerCase().includes('admin');

    if (!isMetadataAdmin) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        
        if (!profile || profile.role !== 'admin') {
          return new NextResponse(JSON.stringify({ error: "Forbidden: Admin access required" }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
      } catch (err) {
        return new NextResponse(JSON.stringify({ error: "Server error verifying role" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
  }

  // 1. Sliding Window Log Rate Limiting (Upstash Redis + Edge Log)
  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // Checkout rate limiting: 15 req/min
  if (url.pathname.startsWith("/checkout") || url.pathname.startsWith("/api/checkout")) {
    const rateLimit = await checkRateLimit(clientIp, "checkout", { windowMs: 60000, maxRequests: 15 });
    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Checkout rate limit exceeded. Please wait a moment before trying again." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }
  }

  // Cart rate limiting: 30 req/min
  if (url.pathname.startsWith("/cart") || url.pathname.startsWith("/api/cart")) {
    const rateLimit = await checkRateLimit(clientIp, "cart", { windowMs: 60000, maxRequests: 30 });
    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Cart mutation rate limit exceeded." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }
  }

  // AI OCR Slip Verification & Upload endpoints: 10 req/min (DDoS & AI Vision API protection)
  if (
    url.pathname.startsWith("/api/orders/verify-slip") ||
    url.pathname.startsWith("/api/order") ||
    url.pathname.startsWith("/api/upload")
  ) {
    const rateLimit = await checkRateLimit(clientIp, "slip_upload", { windowMs: 60000, maxRequests: 10 });
    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Upload and verification rate limit exceeded. Please wait before re-uploading." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }
  }

  const isSensitiveRoute =
    url.pathname.startsWith("/api/order") ||
    url.pathname.startsWith("/api/checkout") ||
    url.pathname.startsWith("/api/orders/verify-slip") ||
    url.pathname.startsWith("/admin");

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
    connect-src 'self' https://*.supabase.co https://api.payhere.lk https://challenges.cloudflare.com https://accounts.google.com https://*.google.com;
    frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com;
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
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
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
