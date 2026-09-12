import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return { supabaseResponse, user: null, supabase: null as any };
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Check if auth tokens exist in cookies before making network call
    const cookies = request.cookies.getAll();
    const hasAuthToken = cookies.some(
      (c) => c.name.includes("auth-token") || c.name.includes("sb-")
    );

    let user = null;
    if (hasAuthToken) {
      try {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;
      } catch (authErr) {
        console.warn("Supabase auth.getUser exception in middleware:", authErr);
      }
    }

    return { supabaseResponse, user, supabase };
  } catch (err) {
    console.warn("Middleware updateSession safe fallback:", err);
    return { supabaseResponse, user: null, supabase: null as any };
  }
}

