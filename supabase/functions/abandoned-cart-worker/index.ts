// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * AETHEX Supabase Edge Function: Abandoned Cart Worker
 * 
 * Can be scheduled via pg_cron or invoked via external webhook.
 * Detects pending bank wire orders > 2 hours old and dispatches recovery emails via Resend.
 */
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    const now = Date.now();
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000).toISOString();

    const { data: abandonedOrders, error } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, total, order_status, status, slip_url, created_at")
      .in("order_status", ["pending_payment", "pending"])
      .is("slip_url", null)
      .lt("created_at", twoHoursAgo)
      .gt("created_at", fortyEightHoursAgo)
      .limit(30);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let dispatched = 0;

    for (const order of abandonedOrders || []) {
      if (!order.customer_email) continue;

      if (resendApiKey) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "AETHEX Concierge <concierge@aethex.store>",
              to: order.customer_email,
              subject: `Reservation Hold: Order #${order.id.slice(0, 8).toUpperCase()} awaits clearance`,
              html: `
                <div style="background-color: #050505; color: #FFFFFF; font-family: sans-serif; padding: 40px;">
                  <h1 style="letter-spacing: 0.3em; font-size: 20px;">A E T H E X</h1>
                  <p style="color: #9A9A9A; font-size: 14px;">Greetings ${order.customer_name || "Valued Client"},</p>
                  <p style="color: #9A9A9A; font-size: 14px;">Your bespoke hardware selection (Order #${order.id.slice(0, 8).toUpperCase()}) is currently held in our priority queue.</p>
                  <p style="color: #FFFFFF; font-size: 16px; font-weight: bold;">Total: ${order.total} LKR</p>
                  <a href="https://aethex.store/checkout?recovery_order=${order.id}" style="background-color: #FFFFFF; color: #000000; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 12px; display: inline-block; margin-top: 16px;">COMPLETE YOUR ORDER</a>
                </div>
              `,
            }),
          });
          dispatched++;
        } catch (e) {
          console.error("Resend edge dispatch notice:", e);
        }
      } else {
        dispatched++;
      }

      await supabase
        .from("orders")
        .update({
          abandoned_email_sent: true,
          abandoned_email_sent_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        scanned: abandonedOrders?.length || 0,
        dispatched,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
