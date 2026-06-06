import { Resend } from "resend";
import { env } from "../lib/env";

const resendApiKey = env.RESEND_API_KEY;
// Safe fallback if key is not provided to prevent runtime compile crashes
export const resend = resendApiKey && resendApiKey !== "re_your_resend_api_key" ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.warn("⚠️ Resend email client is not configured. Email not sent. Content preview:", { to, subject });
    return { success: false, warning: "Resend is not configured." };
  }

  try {
    const data = await resend.emails.send({
      from: "AETHEX Store <orders@aethex.store>", // Ensure domain is verified on Resend
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("❌ Failed to send email via Resend:", error);
    return { success: false, error: error.message };
  }
}

export function generateOrderConfirmationHtml(orderId: string, name: string, total: number, itemsList: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #050505; color: #ffffff; padding: 40px; border-radius: 24px; max-width: 600px; margin: 40px auto; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
      <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; color: #ffffff; letter-spacing: 0.1em; font-family: sans-serif;">AETHEX STORE</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Hello ${name},</p>
      <p style="font-size: 14px; line-height: 1.6; color: #a1a1a6;">Thank you for placing an order request with AETHEX. We have successfully logged your setup configuration in our database.</p>
      
      <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Order Reference</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; font-family: monospace; color: #ffffff; font-weight: bold; select-all: all;">${orderId}</p>
        
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Items Configured</p>
        <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.6; color: #ffffff; white-space: pre-line;">${itemsList}</p>
        
        <p style="margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; color: #a1a1a6; font-weight: bold; letter-spacing: 0.05em;">Total Amount</p>
        <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: bold;">LKR ${total.toLocaleString("en-LK")}</p>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #a1a1a6;">
        <strong>Bespoke Verification Check:</strong> Because you selected the <strong>WhatsApp Checkout Route</strong>, please ensure you complete sending the pre-filled text on WhatsApp. Our curators will check custom keycaps/switches availability and proceed with dispatch.
      </p>

      <p style="font-size: 12px; color: #8e8e93; line-height: 1.5; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; text-align: center;">
        Track order real-time status: <a href="https://aethex.store/track-order" style="color: #ffffff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.25);">aethex.store/track-order</a>
      </p>
    </div>
  `;
}
