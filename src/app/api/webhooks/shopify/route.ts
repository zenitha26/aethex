export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

// Helper function to verify Shopify HMAC using Web Crypto API
async function verifyShopifyWebhook(data: string, hmac: string | null) {
  if (!hmac) return false;
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  const calculatedHmac = btoa(String.fromCharCode(...hashArray));

  return calculatedHmac === hmac;
}

export async function POST(request: Request) {
  try {
    const textData = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256');

    const isValid = await verifyShopifyWebhook(textData, hmacHeader);

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(textData);
    
    // Process the payload here (e.g., save to Supabase)
    const { error } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          id: payload.id.toString(),
          customer_email: payload.email,
          total: payload.total_price,
          order_status: 'processing',
          payment_status: payload.financial_status,
          items: payload.line_items
        }
      ]);

    if (error) {
       console.error("Supabase insert error:", error);
       return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
