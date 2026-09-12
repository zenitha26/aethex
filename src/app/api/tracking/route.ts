import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';

export const runtime = 'edge';

// AfterShip API Key should be stored in .env
// AFTERSHIP_API_KEY=your_key_here

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    // 1. Get the tracking number from the database for this order
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data: trackingData, error: dbError } = await supabaseAdmin
      .from('tracking_updates')
      .select('tracking_number, courier_slug')
      .eq('order_id', orderId)
      .maybeSingle();

    if (dbError || !trackingData || !trackingData.tracking_number) {
      return NextResponse.json({ error: 'Tracking information not available yet' }, { status: 404 });
    }

    const aftershipKey = process.env.AFTERSHIP_API_KEY;
    
    // If no key is configured, return dummy data for now
    if (!aftershipKey) {
      return NextResponse.json({
        tracking_number: trackingData.tracking_number,
        status: "In Transit",
        masked_courier: "Aethex Premium Logistics",
        checkpoints: [
          { message: "Package handed over to Aethex Logistics", location: "Global Fulfillment Center", date: new Date().toISOString() }
        ]
      });
    }

    // 2. Fetch tracking details from AfterShip
    const aftershipUrl = `https://api.aftership.com/v4/trackings/${trackingData.courier_slug || 'aliexpress'}/${trackingData.tracking_number}`;
    
    const aftershipResponse = await fetch(aftershipUrl, {
      method: 'GET',
      headers: {
        'aftership-api-key': aftershipKey,
        'Content-Type': 'application/json'
      }
    });

    if (!aftershipResponse.ok) {
      throw new Error("Failed to fetch from AfterShip API");
    }

    const aftershipData = await aftershipResponse.json();
    const trackingInfo = aftershipData.data.tracking;

    // 3. Masking & Blind Dropshipping Logic
    // We remove any references to AliExpress, Cainiao, China Post, etc.
    const maskedCheckpoints = trackingInfo.checkpoints.map((cp: any) => {
      let msg = cp.message || "";
      // Replace origin country references with generic terms
      msg = msg.replace(/China|Shenzhen|Guangzhou|AliExpress|Cainiao|CN/gi, "Global Fulfillment Center");
      
      return {
        message: msg,
        location: cp.location ? cp.location.replace(/China|Shenzhen|Guangzhou|CN/gi, "Facility") : "En Route",
        date: cp.checkpoint_time
      };
    });

    return NextResponse.json({
      tracking_number: trackingInfo.tracking_number,
      status: trackingInfo.tag, // 'InTransit', 'Delivered', etc.
      masked_courier: "Aethex Premium Logistics", // White-labeled courier name
      checkpoints: maskedCheckpoints.reverse() // Newest first
    });

  } catch (error) {
    console.error('Tracking API Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve tracking data' }, { status: 500 });
  }
}
