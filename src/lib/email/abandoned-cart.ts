import { Resend } from "resend";
import { render } from "@react-email/render";
import AbandonedCartEmail, { AbandonedCartItem } from "@/emails/AbandonedCartEmail";
import { taintServerSecrets } from "@/lib/security/taint";

// Ensure secrets are tainted on server
taintServerSecrets();

export interface DispatchAbandonedCartParams {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  totalAmount: number;
  cartItems?: AbandonedCartItem[];
  recoveryUrl?: string;
}

export interface DispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Dispatches an automated luxury dark-mode Abandoned Cart recovery email
 * via Resend with fallback to simulated telemetry.
 */
export async function dispatchAbandonedCartEmail({
  orderId,
  customerEmail,
  customerName = "Valued Client",
  totalAmount,
  cartItems = [],
  recoveryUrl,
}: DispatchAbandonedCartParams): Promise<DispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://aethex.store";
  const finalRecoveryUrl = recoveryUrl || `${storeUrl}/checkout?recovery_order=${orderId}`;

  // Default fallback item if order didn't have item details persisted
  const formattedItems: AbandonedCartItem[] = cartItems.length > 0
    ? cartItems
    : [
        {
          name: "AETHEX BESPOKE HARDWARE SELECTION",
          price: totalAmount,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
          variant: `Order #${orderId.slice(0, 8).toUpperCase()}`,
        },
      ];

  // Render React Email template to HTML
  const emailHtml = await render(
    AbandonedCartEmail({
      customerName,
      orderId,
      cartItems: formattedItems,
      totalAmount,
      recoveryUrl: finalRecoveryUrl,
    })
  );

  // If Resend API Key is configured, dispatch live email
  if (apiKey && apiKey.startsWith("re_")) {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: "AETHEX Concierge <concierge@aethex.store>",
        to: customerEmail,
        subject: `Reservation Hold: Order #${orderId.slice(0, 8).toUpperCase()} awaits clearance`,
        html: emailHtml,
      });

      if (error) {
        console.warn("Resend API error dispatching abandoned cart email:", error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        messageId: data?.id,
        simulated: false,
      };
    } catch (err: any) {
      console.error("Resend dispatch exception:", err);
      return { success: false, error: err?.message };
    }
  }

  // Simulated telemetry for local development / testing without live Resend key
  console.log(`[AETHEX TELEMETRY] Simulated Abandoned Cart Email to ${customerEmail} for Order ${orderId} (${totalAmount} LKR)`);
  return {
    success: true,
    messageId: `sim_${Date.now()}_${orderId.slice(0, 6)}`,
    simulated: true,
  };
}
