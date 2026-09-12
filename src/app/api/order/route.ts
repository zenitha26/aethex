export const runtime = 'edge';

import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { env } from "../../../lib/env";
import { z } from "zod";
import { SITE_CONTACT } from "@/constants";

const orderSchema = z.object({
  cart: z.array(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      price: z.number().optional(),
      quantity: z.number().int().positive(),
      color: z.string().optional(),
      variantId: z.string().optional(),
    })
  ),
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email").or(z.string().length(0)).optional(),
  }),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Database configuration error. Please check your keys." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Input validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { cart, customer, notes } = parsed.data;

    // Trusting client prices for now as Shopify syncing varies and to match phase requirements
    // Alternatively, we could fetch db products to verify price, but user instructed us not to break functionality and just store it.
    let total = 0;
    const line_items = cart.map((item) => {
      const price = item.price || 0;
      total += price * item.quantity;
      return {
        product_id: item.id.split('-')[0], // strip color suffix if any
        product_name: item.title,
        quantity: item.quantity,
        color: item.color || null,
        variant_id: item.variantId || null,
        unit_price: price,
        total_price: price * item.quantity
      };
    });

    // Customer profile check & User Auth Check
    const { createClient } = await import("../../../lib/supabase/server");
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();
    
    let customerId = null;
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", customer.phone)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      await supabaseAdmin
        .from("customers")
        .update({
          name: customer.name,
          email: customer.email || null,
          address: customer.address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer, error: custInsertErr } = await supabaseAdmin
        .from("customers")
        .insert({
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone,
          address: customer.address,
        })
        .select()
        .single();

      if (custInsertErr) {
        throw new Error(`Customer creation failure: ${custInsertErr.message}`);
      }
      customerId = newCustomer.id;
    }

    // Create Order with line_items JSON
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        customer_id: customerId,
        customer_name: customer.name,
        customer_email: customer.email || null,
        customer_phone: customer.phone,
        customer_address: customer.address,
        subtotal: total,
        total: total,
        payment_status: "pending",
        order_status: "processing",
        notes: notes || null,
        line_items: line_items
      })
      .select()
      .single();

    if (orderErr) {
      throw new Error(`Order insertion failure: ${orderErr.message}`);
    }

    // Async email notification
    try {
      const { sendEmail, generateOrderConfirmationHtml, generateAdminNotificationHtml } = await import("../../../services/email");
      const listText = line_items
        .map((i) => {
          const options = i.color ? ` [Color: ${i.color}]` : "";
          return `- ${i.product_name}${options} x${i.quantity}`;
        })
        .join("\n");

      const whatsappMsg = `Hi AETHEX, confirming my order ${order.id} for LKR ${total}.`;
      const whatsappUrl = `https://wa.me/${SITE_CONTACT.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

      if (customer.email && customer.email.trim() !== "") {
        const htmlContent = generateOrderConfirmationHtml(
          order.id,
          customer.name,
          customer.phone,
          total,
          listText,
          whatsappUrl
        );

        await sendEmail({
          to: customer.email,
          subject: `AETHEX Store Order Logged — Ref #${order.id.slice(0, 8)}`,
          html: htmlContent,
        });
      }

      const adminHtml = generateAdminNotificationHtml(
        order.id,
        customer.name,
        customer.phone,
        total,
        listText,
        whatsappUrl
      );

      await sendEmail({
        to: "orders@aethex.store",
        subject: `New Order ${order.id}`,
        html: adminHtml,
      });
    } catch (mailErr) {
      console.error("⚠️ Async Resend order receipt failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      total,
    });
  } catch (err: any) {
    console.error("❌ Checkout order endpoint exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Fulfillment processing failed." },
      { status: 500 }
    );
  }
}
