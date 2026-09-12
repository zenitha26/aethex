import { NextResponse } from "next/server";
import { createClient } from "./server";
import type { User } from "@supabase/supabase-js";

export interface AuthenticatedContext {
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

export interface ServerWrapperOptions {
  auth?: "user" | "admin" | "optional";
}

/**
 * Next.js Edge / Server Route Handler Security Wrapper
 * Validates the user's JWT and session before executing the route handler.
 * 
 * Usage:
 * export const POST = withSupabaseServer(async (req, { user, supabase }) => {
 *   // user is guaranteed non-null
 * }, { auth: 'user' });
 */
export function withSupabaseServer(
  handler: (req: Request, ctx: AuthenticatedContext) => Promise<Response>,
  options: ServerWrapperOptions = { auth: "user" }
) {
  return async (req: Request): Promise<Response> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (options.auth === "user" || options.auth === "admin") {
        if (authError || !user) {
          return NextResponse.json(
            { error: "Unauthorized: Invalid, expired, or missing user JWT session." },
            { status: 401 }
          );
        }

        if (options.auth === "admin") {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

          const isAdmin =
            profile?.role === "admin" ||
            user.app_metadata?.role === "admin" ||
            user.user_metadata?.role === "admin";

          if (!isAdmin) {
            return NextResponse.json(
              { error: "Forbidden: Administrator role required." },
              { status: 403 }
            );
          }
        }

        return await handler(req, { user, supabase });
      }

      return await handler(req, { user: user as any, supabase });
    } catch (err: any) {
      console.error("withSupabaseServer Error:", err);
      return NextResponse.json(
        { error: err?.message || "Internal server authorization error." },
        { status: 500 }
      );
    }
  };
}
