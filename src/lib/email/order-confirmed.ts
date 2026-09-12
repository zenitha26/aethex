import { Resend } from "resend";
import { render } from "@react-email/render";
import OrderConfirmedEmail, { 
  OrderConfirmedItem, 
  ShippingAddressInfo 
} from "@/emails/OrderConfirmedEmail";
import { taintServerSecrets } from "@/lib/security/taint";

// Ensure secrets are tainted on server
taintServerSecrets();

export interface DispatchOrderConfirmedParams {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  items?: OrderConfirmedItem[];
  subtotal?: number;
  shippingFee?: number;
  totalAmount: number;
  paymentMethod?: string;
  shippingAddress?: ShippingAddressInfo;
  orderUrl?: string;
}

export interface DispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Dispatches an automated luxury dark-mode Order Confirmed notification email
 * via Resend with fallback to simulated telemetry.
 */
export async function dispatchOrderConfirmedEmail({
  orderId,
  customerEmail,
  customerName = "Distinguished Patron",
  items = [],
  subtotal,
  shippingFee = 350,
  totalAmount,
  paymentMethod = "Direct Bank Transfer (Verified)",
  shippingAddress,
  orderUrl,
}: DispatchOrderConfirmedParams): Promise<DispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://www.aethexstore.com";
  const finalOrderUrl = orderUrl || `${storeUrl}/account/orders/${orderId}`;

  const calculatedSubtotal = subtotal !== undefined ? subtotal : totalAmount - shippingFee;

  // Render React Email template to HTML
  const emailHtml = await render(
    OrderConfirmedEmail({
      customerName,
      orderId,
      items: items.length > 0 ? items : [
        {
          name: "ASPOR A711 360° Console Car Phone Mount",
          sku: "AET-A711-BLK",
          price: calculatedSubtotal,
          quantity: 1,
          image: "https://www.aethexstore.com/images/a711/cockpit_matte.jpg",
        }
      ],
      subtotal: calculatedSubtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      shippingAddress: shippingAddress || {
        name: customerName,
        address: "Sri Lanka Delivery Address",
        city: "Colombo",
        district: "Western Province",
        phone: "+94 78 234 9954",
      },
      orderUrl: finalOrderUrl,
    })
  );

  // If Resend API Key is configured, dispatch live email
  if (apiKey && apiKey.startsWith("re_")) {
    try {
      const resend = new Resend(apiKey);
      const { data, error } = await resend.emails.send({
        from: "AETHEX Concierge <concierge@aethexstore.com>",
        to: customerEmail,
        subject: `Order Authenticated: #${orderId.slice(0, 8).toUpperCase()} Dispatched to Atelier`,
        html: emailHtml,
      });

      if (error) {
        console.warn("Resend API error dispatching order confirmed email:", error);
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
  console.log(`[AETHEX TELEMETRY] Simulated Order Confirmed Email to ${customerEmail} for Order ${orderId} (${totalAmount} LKR)`);
  return {
    success: true,
    messageId: `sim_confirm_${Date.now()}_${orderId.slice(0, 6)}`,
    simulated: true,
  };
}
