import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";
import { env } from "../../../lib/env";
import { z } from "zod";

const orderSchema = z.object({
  cart: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      customization: z
        .object({
          switches: z.string(),
          keycaps: z.string(),
          caseStyle: z.string(),
        })
        .optional(),
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

    // 1. Fetch DB prices for standard items
    const standardProductIds = cart
      .filter((i) => i.productId !== "custom-keyboard")
      .map((i) => i.productId);

    let dbProducts: any[] = [];
    if (standardProductIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("*")
        .in("id", standardProductIds);

      if (error) {
        throw new Error(`Failed to verify products in database: ${error.message}`);
      }
      dbProducts = data || [];
    }

    // 2. Pricing tables matching KeyboardBuilder.tsx rules
    const CUSTOM_KEYBOARD_BASE = 45000;
    const SWITCH_PRICES: Record<string, number> = {
      "Silent Linear": 0,
      "Tactile Horizon": 3000,
      "Clicky Classic": 4500,
    };
    const KEYCAP_PRICES: Record<string, number> = {
      "Space Gray": 0,
      "Silver White": 5000,
      "Champagne Gold": 7500,
    };
    const CASE_PRICES: Record<string, number> = {
      "Frosted Glass": 0,
      "Anodized Slate": 12000,
      "Brushed Brass": 18000,
    };

    // Calculate totals server-side (Never trust client prices)
    let total = 0;
    const verifiedItems = cart.map((item) => {
      let price = 0;
      let title = "";

      if (item.productId === "custom-keyboard") {
        const sw = item.customization?.switches || "Silent Linear";
        const kc = item.customization?.keycaps || "Space Gray";
        const cs = item.customization?.caseStyle || "Frosted Glass";

        const swPrice = SWITCH_PRICES[sw] ?? 0;
        const kcPrice = KEYCAP_PRICES[kc] ?? 0;
        const csPrice = CASE_PRICES[cs] ?? 0;

        price = CUSTOM_KEYBOARD_BASE + swPrice + kcPrice + csPrice;
        title = `Aethex Custom Keyboard (${sw}, ${kc}, ${cs})`;
      } else {
        const prod = dbProducts.find((p) => p.id === item.productId);
        if (!prod) {
          throw new Error(`Product reference not found: ${item.productId}`);
        }
        price = Number(prod.price);
        title = prod.title;
      }

      total += price * item.quantity;
      return {
        product_id: item.productId === "custom-keyboard" ? null : item.productId,
        title,
        price,
        quantity: item.quantity,
        customization: item.customization || null,
      };
    });

    // 3. Customer profile check & update or insert
    let customerId = null;
    const { data: existingCustomer } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", customer.phone)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update info in profile
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

    // 4. Create Order
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
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
      })
      .select()
      .single();

    if (orderErr) {
      throw new Error(`Order insertion failure: ${orderErr.message}`);
    }

    // 5. Create Order Items
    const orderItemsPayload = verifiedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      customization: item.customization,
    }));

    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsErr) {
      throw new Error(`Order items creation failure: ${itemsErr.message}`);
    }

    // 6. Async email notification
    if (customer.email && customer.email.trim() !== "") {
      try {
        const { sendEmail, generateOrderConfirmationHtml } = await import("../../../services/email");
        const listText = verifiedItems
          .map((i) => {
            const options = i.customization
              ? ` [Switches: ${i.customization.switches}, Caps: ${i.customization.keycaps}, Frame: ${i.customization.caseStyle}]`
              : "";
            return `- ${i.title}${options} x${i.quantity}`;
          })
          .join("\n");

        const htmlContent = generateOrderConfirmationHtml(
          order.id,
          customer.name,
          total,
          listText
        );

        await sendEmail({
          to: customer.email,
          subject: `AETHEX Store Order Logged — Ref #${order.id.slice(0, 8)}`,
          html: htmlContent,
        });
      } catch (mailErr) {
        console.error("⚠️ Async Resend order receipt failed:", mailErr);
      }
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
