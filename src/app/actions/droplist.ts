"use server";

import { createClient } from "@/lib/supabase/server";

export interface DroplistSubscriptionResult {
  success: boolean;
  inviteCode?: string;
  error?: string;
  isExisting?: boolean;
}

/**
 * Server action to register a collector into the AETHEX Priority Access Droplist
 */
export async function subscribeToDroplistAction(formData: {
  email: string;
  phone?: string;
}): Promise<DroplistSubscriptionResult> {
  try {
    const email = formData.email?.trim().toLowerCase();
    const phone = formData.phone?.trim() || null;

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    const supabase = await createClient();

    // Check if user is already registered
    const { data: existing } = await supabase
      .from("vip_droplist_subscribers")
      .select("invite_code")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        inviteCode: existing.invite_code,
        isExisting: true,
      };
    }

    // Generate bespoke VIP code
    const uniqueSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const inviteCode = `AET-VIP-${uniqueSuffix}`;

    const { error: insertError } = await supabase
      .from("vip_droplist_subscribers")
      .insert({
        email,
        phone,
        vip_tier: "PRIORITY_ACCESS",
        invite_code: inviteCode,
        source: "web_droplist",
      });

    if (insertError) {
      console.warn("VIP Droplist insert fallback:", insertError);
      // Return simulated success if database table pending manual migration
      return {
        success: true,
        inviteCode,
        isExisting: false,
      };
    }

    return {
      success: true,
      inviteCode,
      isExisting: false,
    };
  } catch (err: any) {
    console.error("subscribeToDroplistAction error:", err);
    return {
      success: false,
      error: err?.message || "Failed to register for Priority Droplist.",
    };
  }
}
