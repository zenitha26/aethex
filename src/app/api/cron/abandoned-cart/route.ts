import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { dispatchAbandonedCartEmail } from "@/lib/email/abandoned-cart";
import { taintServerSecrets } from "@/lib/security/taint";

// Ensure secrets are tainted on server
taintServerSecrets();

export const runtime = 'edge';
export const dynamic = "force-dynamic";

/**
 * AETHEX Cron Worker: Abandoned Cart Email Automation
 * 
 * Scans database for pending bank wire orders created > 2 hours ago
 * where no payment slip has been uploaded, and dispatches the luxury
 * recovery email via Resend.
 */
async function processAbandonedCarts(request: Request) {
  try {
    // 1. Optional Bearer / CRON_SECRET authorization check
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In production, enforce secret if configured
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized: Invalid CRON_SECRET." }, { status: 401 });
      }
    }

    const supabase = await createClient();

    // 2. Define abandonment threshold: > 2 hours ago and < 48 hours ago
    const now = Date.now();
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000).toISOString();

    // 3. Fetch candidate abandoned orders
    const { data: abandonedOrders, error: fetchError } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, total, order_status, status, slip_url, created_at, abandoned_email_sent")
      .in("order_status", ["pending_payment", "pending"])
      .is("slip_url", null)
      .lt("created_at", twoHoursAgo)
      .gt("created_at", fortyEightHoursAgo)
      .or("abandoned_email_sent.is.null,abandoned_email_sent.eq.false")
      .limit(50);

    if (fetchError) {
      console.error("Cron fetch error (checking if column abandoned_email_sent exists):", fetchError);
      // Fallback query without abandoned_email_sent filter if column hasn't been migrated yet
      const { data: fallbackOrders, error: fallbackError } = await supabase
        .from("orders")
        .select("id, customer_name, customer_email, total, order_status, status, slip_url, created_at")
        .in("order_status", ["pending_payment", "pending"])
        .is("slip_url", null)
        .lt("created_at", twoHoursAgo)
        .gt("created_at", fortyEightHoursAgo)
        .limit(20);

      if (fallbackError || !fallbackOrders) {
        return NextResponse.json({
          success: true,
          message: "Database schema pending migration or no active abandoned records.",
          processedCount: 0,
          notice: fallbackError?.message,
        });
      }

      return await dispatchAndReport(supabase, fallbackOrders);
    }

    if (!abandonedOrders || abandonedOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No abandoned carts detected (> 2 hours old).",
        processedCount: 0,
      });
    }

    return await dispatchAndReport(supabase, abandonedOrders);
  } catch (err: any) {
    console.error("Abandoned cart cron worker error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error in abandoned cart worker." },
      { status: 500 }
    );
  }
}

async function dispatchAndReport(supabase: any, orders: any[]) {
  const results = [];
  let sentCount = 0;
  let totalRecoverableValue = 0;

  for (const order of orders) {
    if (!order.customer_email) continue;

    const dispatchRes = await dispatchAbandonedCartEmail({
      orderId: order.id,
      customerEmail: order.customer_email,
      customerName: order.customer_name || "Valued Client",
      totalAmount: Number(order.total || 0),
    });

    if (dispatchRes.success) {
      sentCount++;
      totalRecoverableValue += Number(order.total || 0);

      // Flag order as dispatched to prevent duplicate spam
      try {
        await supabase
          .from("orders")
          .update({
            abandoned_email_sent: true,
            abandoned_email_sent_at: new Date().toISOString(),
          })
          .eq("id", order.id);
      } catch (updateErr) {
        console.warn("Order flag update notice:", updateErr);
      }
    }

    results.push({
      orderId: order.id,
      email: order.customer_email,
      total: order.total,
      dispatch: dispatchRes,
    });
  }

  return NextResponse.json({
    success: true,
    processedCount: orders.length,
    dispatchedCount: sentCount,
    totalRecoverableLKR: totalRecoverableValue,
    executions: results,
    timestamp: new Date().toISOString(),
  });
}

export async function GET(request: Request) {
  return processAbandonedCarts(request);
}

export async function POST(request: Request) {
  return processAbandonedCarts(request);
}
