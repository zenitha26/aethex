export const runtime = 'edge';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../../lib/supabase";

export async function POST(request: Request) {
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

    const { type, brand } = await request.json();

    if (!type || !brand) {
      return NextResponse.json({ error: "Missing type or brand parameters." }, { status: 400 });
    }

    const templates: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
      shipping: {
        title: "Shipping & Fulfillment Policy",
        sections: [
          {
            heading: "Complimentary Delivery",
            body: `All premium workspace modules and keyboards from ${brand} are shipped islandwide within Sri Lanka completely free of charge.`,
          },
          {
            heading: "Fulfillment Timelines",
            body: "Fulfillment takes 1-3 business days. Delivery is completed within 12-15 business days via tracked international logistics directly to your doorstep.",
          },
          {
            heading: "Duty & Clearance",
            body: "All customs clearances, handling charges, and delivery import duty are covered by AETHEX. There are no additional charges on delivery.",
          },
        ],
      },

      refund: {
        title: "Refund & Replacement Policy",
        sections: [
          {
            heading: "AETHEX Satisfaction Guarantee",
            body: `At ${brand}, we offer complete replacements or full refunds on any item that arrives damaged or non-functional.`,
          },
          {
            heading: "No-Return Policy",
            body: "To maintain hygiene and customer safety, workspace peripherals do not need to be physically shipped back to our center.",
          },
          {
            heading: "Verification Requirements",
            body: "A continuous unboxing video of the parcel showing the shipping label and product defect must be submitted within 48 hours of delivery.",
          },
        ],
      },

      terms: {
        title: "Terms of Service",
        sections: [
          {
            heading: "Acceptance of Terms",
            body: `By browsing or placing an order at ${brand}, you agree to the conditions, terms, and purchase policies detailed herein.`,
          },
          {
            heading: "Customer Conduct",
            body: "Peripherals ordered from this website are intended for individual customer configurations and personal workstation setups.",
          },
          {
            heading: "WhatsApp Orders",
            body: "Order confirmation is subject to manual verification on WhatsApp. The seller reserves the right to reject order requests.",
          },
        ],
      },

      privacy: {
        title: "Privacy Policy",
        sections: [
          {
            heading: "Information Collection",
            body: `At ${brand}, we only collect customer details necessary to fulfill orders: full name, shipping address, email address, and phone number.`,
          },
          {
            heading: "Data Sharing",
            body: "We share transaction details with our shipping partners strictly for fulfillment and processing purposes.",
          },
          {
            heading: "Security Protocols",
            body: "All connection data and order inputs are secured via SSL/TLS and database row-level security parameters.",
          },
        ],
      },

      cookies: {
        title: "Cookie Policy",
        sections: [
          {
            heading: "Use of Cookies",
            body: `We use cookies on the ${brand} platform to persist your shopping cart state and remember user preferences during customization sessions.`,
          },
          {
            heading: "Control of Cookies",
            body: "You can choose to disable cookies in your web browser, but please note that some ecommerce tracking and cart features may cease to function.",
          },
        ],
      },
    };

    const policy = templates[type];
    if (!policy) {
      return NextResponse.json({ error: "Invalid policy type." }, { status: 400 });
    }

    // De-activate existing policies of same type
    await supabaseAdmin
      .from("policies")
      .update({ is_active: false })
      .eq("type", type);

    const { data, error } = await supabaseAdmin
      .from("policies")
      .insert({
        type,
        title: policy.title,
        content: policy,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase policy insertion error:", error);
      return NextResponse.json({ error: "Failed to store policy in database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, policy: data });
  } catch (err) {
    console.error("Policy generator route error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
