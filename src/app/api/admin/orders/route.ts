import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function GET() {
  try {
    // 1. Authorize Admin Session (await cookies in Next.js 15)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("aethex_admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    // 2. Fetch all orders with tracking updates
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        tracking_updates(*)
      `)
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Fetch orders error:", ordersError);
      return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("Admin orders GET route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("aethex_admin_session")?.value;
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database configuration error." }, { status: 500 });
    }

    const { order_id, payment_status, order_status, tracking_number, courier } = await request.json();

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id." }, { status: 400 });
    }

    // 1. Update main Order details
    const updatePayload: Record<string, string> = {};
    if (payment_status) updatePayload.payment_status = payment_status;
    if (order_status) updatePayload.order_status = order_status;
    updatePayload.updated_at = new Date().toISOString();

    if (Object.keys(updatePayload).length > 0) {
      const { error: orderUpdateError } = await supabaseAdmin
        .from("orders")
        .update(updatePayload)
        .eq("id", order_id);

      if (orderUpdateError) {
        console.error("Order update error:", orderUpdateError);
        return NextResponse.json({ error: "Failed to update order details." }, { status: 500 });
      }
    }

    // 2. Update or Insert Tracking Updates
    if (tracking_number) {
      const trackingStatus = order_status === "delivered" ? "delivered" : "in-transit";

      // Check if tracking update exists
      const { data: existingTracking } = await supabaseAdmin
        .from("tracking_updates")
        .select("id")
        .eq("order_id", order_id)
        .maybeSingle();

      if (existingTracking) {
        // Update
        const { error: trackingUpdateError } = await supabaseAdmin
          .from("tracking_updates")
          .update({
            tracking_number,
            courier: courier || "AliExpress",
            status: trackingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("order_id", order_id);

        if (trackingUpdateError) {
          console.error("Tracking update error:", trackingUpdateError);
          return NextResponse.json({ error: "Failed to update tracking info." }, { status: 500 });
        }
      } else {
        // Insert
        const { error: trackingInsertError } = await supabaseAdmin
          .from("tracking_updates")
          .insert({
            order_id,
            tracking_number,
            courier: courier || "AliExpress",
            status: trackingStatus,
          });

        if (trackingInsertError) {
          console.error("Tracking insertion error:", trackingInsertError);
          return NextResponse.json({ error: "Failed to insert tracking info." }, { status: 500 });
        }
      }
    }

    // 3. Automated Resend Notification on order dispatch (shipped)
    if (order_status === "shipped" && tracking_number) {
      try {
        const { sendEmail } = await import("../../../services/email");

        const { data: orderDetails } = await supabaseAdmin
          .from("orders")
          .select("customer_name, customer_email")
          .eq("id", order_id)
          .single();

        if (orderDetails?.customer_email) {
          const trackingHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: 40px auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; color: #ffffff; letter-spacing: 0.1em; font-family: sans-serif;">AETHEX STORE</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Hello ${orderDetails.customer_name},</p>
              <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Great news! Your premium custom setup peripherals have been dispatched from our distribution hub and are now in transit.</p>
              
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
                <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Order Reference</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; font-family: monospace; color: #ffffff; font-weight: bold;">${order_id}</p>
                
                <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Logistics Courier</p>
                <p style="margin: 0 0 20px 0; font-size: 14px; color: #ffffff; font-weight: bold;">${courier || "AliExpress"}</p>

                <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Tracking ID</p>
                <p style="margin: 0; font-size: 14px; font-family: monospace; color: #ffffff; font-weight: bold; select-all: all;">${tracking_number}</p>
              </div>

              <p style="font-size: 13px; line-height: 1.6; color: #a1a1a6;">
                You can track your package progress in real-time on our tracking panel: <a href="https://aethex.store/track-order" style="color: #ffffff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.25);">aethex.store/track-order</a>
              </p>
            </div>
          `;

          await sendEmail({
            to: orderDetails.customer_email,
            subject: `AETHEX Shipment Dispatched — Ref #${order_id.slice(0, 8)}`,
            html: trackingHtml,
          });
        }
      } catch (emailErr) {
        console.error("⚠️ Failed to dispatch shipment email:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin orders PUT route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
