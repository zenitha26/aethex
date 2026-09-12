export const runtime = 'edge';

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const errorCode = searchParams.get("error_code");

  // 1. Check for provider/OAuth level errors in the callback URL
  if (errorParam || errorDescription) {
    const rawError = {
      error: errorParam,
      errorCode: errorCode || "OAUTH_PROVIDER_ERROR",
      description: errorDescription,
      allParams: Object.fromEntries(searchParams.entries()),
    };

    console.error("\n========================================================");
    console.error("🔴 [SUPABASE API AUTH ERROR] Google OAuth returned an error in callback:");
    console.error("• Raw Error:", JSON.stringify(rawError, null, 2));
    console.error("• Error Code:", errorCode || errorParam);
    console.error("• Error Description:", errorDescription || errorParam);
    console.error("• Request URL:", request.url);
    console.error("• Stack Trace:", new Error().stack);
    console.error("========================================================\n");

    const userMessage = errorDescription || errorParam || "Authentication with Google failed";
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(userMessage)}`);
  }

  // 2. Missing authorization code validation
  if (!code) {
    console.error("\n========================================================");
    console.error("🔴 [SUPABASE API AUTH ERROR] Missing authorization code in callback URL:");
    console.error("• Request URL:", request.url);
    console.error("• Params:", Object.fromEntries(searchParams.entries()));
    console.error("• Stack Trace:", new Error().stack);
    console.error("========================================================\n");

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Authentication failed: No authorization code was returned from Google.")}`
    );
  }

  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!;

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("\n========================================================");
      console.error("🔴 [SUPABASE API AUTH ERROR] Failed to exchange code for session:");
      console.error("• Raw Error:", exchangeError);
      console.error("• Error Code / Status:", (exchangeError as any).code || (exchangeError as any).status || "EXCHANGE_FAILED");
      console.error("• Error Message:", exchangeError.message);
      console.error("• Error Name:", exchangeError.name);
      console.error("• Request URL:", request.url);
      console.error("• Stack Trace:", exchangeError.stack || new Error().stack);
      console.error("========================================================\n");

      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(exchangeError.message || "Failed to complete Google authentication session.")}`
      );
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (fatalErr: any) {
    console.error("\n========================================================");
    console.error("🔴 [SUPABASE API AUTH FATAL ERROR] Unexpected exception in auth callback:");
    console.error("• Raw Error:", fatalErr);
    console.error("• Error Message:", fatalErr?.message || String(fatalErr));
    console.error("• Stack Trace:", fatalErr?.stack || new Error().stack);
    console.error("========================================================\n");

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(fatalErr?.message || "An unexpected server error occurred during Google sign-in.")}`
    );
  }
}

