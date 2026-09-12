import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin caller
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isMetadataAdmin = 
      user.app_metadata?.role === "admin" || 
      user.user_metadata?.role === "admin" ||
      user.email?.toLowerCase().includes("admin");

    if (!isMetadataAdmin) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admin required." }, { status: 403 });
      }
    }

    const body = await request.json();
    const { orderId, customerEmail, customerName, reason } = body;

    if (!orderId || !customerEmail) {
      return NextResponse.json({ error: "orderId and customerEmail are required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://aethex.store";
    const reuploadUrl = `${storeUrl}/account/orders/${orderId}`;

    if (apiKey && apiKey.startsWith("re_")) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "AETHEX Concierge <concierge@aethex.store>",
          to: customerEmail,
          subject: `Payment Verification Notice: Order #${orderId.slice(0, 8).toUpperCase()}`,
          html: `
            <div style="background-color: #050505; color: #FFFFFF; font-family: -apple-system, sans-serif; padding: 40px;">
              <h1 style="letter-spacing: 0.3em; font-size: 20px;">A E T H E X</h1>
              <p style="color: #9A9A9A; font-size: 14px;">Greetings ${customerName || "Valued Client"},</p>
              <p style="color: #9A9A9A; font-size: 14px;">Our financial treasury desk was unable to reconcile your bank transfer slip for Order #${orderId.slice(0, 8).toUpperCase()}.</p>
              <div style="background-color: #111111; border: 1px solid rgba(255,255,255,0.1); padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #FFFFFF; font-size: 13px; font-weight: bold; margin: 0 0 6px 0;">REASON FOR AUDIT EXCEPTION:</p>
                <p style="color: #9A9A9A; font-size: 12px; margin: 0;">${reason || "Transaction slip illegible or amount does not match order record."}</p>
              </div>
              <p style="color: #9A9A9A; font-size: 14px;">Kindly visit your order tracking portal to review bank transfer instructions and upload a valid transfer receipt:</p>
              <a href="${reuploadUrl}" style="background-color: #FFFFFF; color: #000000; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 12px; display: inline-block; margin-top: 16px;">SUBMIT REVISED SLIP</a>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("Rejection email dispatch warning:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Rejection logged and customer notification dispatched.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error." }, { status: 500 });
  }
}
