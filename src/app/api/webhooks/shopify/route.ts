import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '../../../../lib/supabase';

// HMAC verification function
async function verifyShopifyWebhook(request: Request, rawBody: string) {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!hmacHeader || !secret) {
    console.error("HMAC header or secret missing");
    return false;
  }

  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const topic = request.headers.get('x-shopify-topic');

    if (!topic) {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const isValid = await verifyShopifyWebhook(request, rawBody);
    if (!isValid) {
      console.warn("HMAC verification failed!");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase client error' }, { status: 500 });
    }

    // Insert to queue immediately for 0% packet loss processing
    const { error } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        topic: topic,
        payload: payload,
        status: 'pending'
      });

    if (error) {
      console.error('[Shopify Webhook] Queue insertion failed', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Return 200 OK instantly to Shopify
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook Handler Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
