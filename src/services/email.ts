import { Resend } from "resend";
import { env } from "../lib/env";

const resendApiKey = env.RESEND_API_KEY;
// Safe fallback if key is not provided to prevent runtime compile crashes
export const resend = resendApiKey && resendApiKey !== "re_your_resend_api_key" ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams) {
  if (!resend) {
    console.warn("Resend not configured");
    return {
      success: false,
      warning: "Email provider not configured",
    };
  }

  try {
    const data = await resend.emails.send({
      from: "AETHEX Store <orders@aethex.store>",
      to,
      subject,
      html,
      replyTo,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
}

export function formatLKR(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderConfirmationHtml(
  orderId: string,
  customerName: string,
  phone: string,
  total: number,
  itemsList: string,
  whatsappUrl: string
) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: 40px auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
      <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; color: #ffffff; letter-spacing: 0.1em; font-family: sans-serif;">AETHEX STORE</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Hello ${customerName},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Thank you for placing an order request with AETHEX. We have successfully logged your setup configuration in our database.</p>
      
      <div style="background:#0f0f0f; border:1px solid rgba(255,255,255,.08); border-radius:16px; padding:20px; margin:20px 0;">
        <p style="margin: 0 0 4px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Status</p>
        <h3 style="margin: 0; font-size: 16px; color: #ffffff;">Pending WhatsApp Verification</h3>
      </div>

      <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Order Reference</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; font-family: monospace; color: #ffffff; font-weight: bold;">${orderId}</p>
        
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Contact Phone</p>
        <p style="margin: 0 0 20px 0; font-size: 13px; color: #ffffff; font-weight: bold;">${phone}</p>

        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Items Configured</p>
        <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #ffffff; white-space: pre-line;">${itemsList}</p>
        
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Total Amount</p>
        <p style="margin: 0 0 20px 0; font-size: 18px; color: #ffffff; font-weight: bold;">${formatLKR(total)}</p>

        <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
          <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Estimated Delivery</p>
          <strong style="font-size: 14px; color: #ffffff;">3–7 Business Days</strong>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${whatsappUrl}" style="display:inline-block; background:#25D366; color:white; padding:14px 24px; border-radius:999px; text-decoration:none; font-weight:bold; margin-top:20px;">
          Complete Order on WhatsApp
        </a>
      </div>

      <p style="font-size: 12px; color: #8e8e93; line-height: 1.5; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; text-align: center;">
        Track order real-time status: <a href="https://aethex.store/track-order" style="color: #ffffff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.25);">aethex.store/track-order</a>
      </p>
    </div>
  `;
}

export function generateAdminNotificationHtml(
  orderId: string,
  customerName: string,
  phone: string,
  total: number,
  itemsList: string,
  whatsappUrl: string
) {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>🚨 New Order Received: ${orderId}</h2>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Phone Number:</strong> ${phone}</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <hr />
      <h3>Products</h3>
      <pre style="white-space: pre-line;">${itemsList}</pre>
      <hr />
      <h3>Total: ${formatLKR(total)}</h3>
      <a href="${whatsappUrl}">Review Customer WhatsApp Message</a>
    </div>
  `;
}
