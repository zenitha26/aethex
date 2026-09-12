// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

declare const Deno: any;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export interface AuthenticatedContext {
  user: any;
  callerSupabase: any;
  serviceSupabase: any;
}

export interface WrapperOptions {
  auth?: "user" | "admin" | "optional" | "none";
}

/**
 * Supabase Edge Function Server Wrapper
 * Validates the caller's JWT before executing the inner request handler.
 * 
 * Usage:
 * Deno.serve(withSupabaseServer(async (req, ctx) => {
 *   // ctx.user is guaranteed to be validated
 * }, { auth: 'user' }));
 */
export function withSupabaseServer(
  handler: (req: Request, ctx: AuthenticatedContext) => Promise<Response>,
  options: WrapperOptions = { auth: "user" }
) {
  return async (req: Request): Promise<Response> => {
    // Handle CORS preflight requests immediately
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // elevated service client strictly isolated on edge runtime
    const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);

    if (options.auth === "user" || options.auth === "admin") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Missing Authorization header." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const callerSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      // Strict validation of caller JWT before handler runs
      const { data: { user }, error: authError } = await callerSupabase.auth.getUser();

      if (authError || !user) {
        return new Response(
          JSON.stringify({ 
            error: "Unauthorized: JWT verification failed or expired session.",
            details: authError?.message 
          }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (options.auth === "admin") {
        const { data: profile } = await serviceSupabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.role !== "admin") {
          return new Response(
            JSON.stringify({ error: "Forbidden: Administrator privileges required." }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      return handler(req, { user, callerSupabase, serviceSupabase });
    }

    return handler(req, { user: null, callerSupabase: null, serviceSupabase });
  };
}
