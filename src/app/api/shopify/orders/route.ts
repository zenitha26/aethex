import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // 1. Verify Authentication using Supabase JWT
    const cookieStore = await cookies();
    const token = cookieStore.get('sb-access-token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate token and user role
    // මෙන්න මේ පේළියෙන් තමයි අර TypeScript error එක නැති කරන්නේ
    if (!supabaseAdmin) {
      throw new Error("Supabase Admin client is not initialized");
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // 3. Admin logic: Fetch orders from Shopify or Supabase Mirror
    // We use the secure backend supabaseAdmin (Service Role) here
    const { data: orders, error: dbError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error('Shopify API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}