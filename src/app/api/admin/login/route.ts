import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password, turnstileToken } = await request.json();

    if (!username || !password || !turnstileToken) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    // 1. Verify Cloudflare Turnstile Token
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
    const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const verifyResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: turnstileToken,
      }),
    });

    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: "Bot verification failed." }, { status: 400 });
    }

    // 2. Validate Credentials
    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "aethexadmin123";

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    // 3. Set Secure HTTP-Only Cookie
    const response = NextResponse.json({ success: true });
    
    // Cookie details: HTTP-only, secure in production, SameSite=Strict, path=/
    response.cookies.set("aethex_admin_session", "authenticated_session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login API error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
