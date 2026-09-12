-- Webhook Events Queue
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  payload jsonb not null,
  status text default 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  retry_count int default 0,
  last_error text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Realtime broadcast for orders
alter publication supabase_realtime add table orders;

-- RPC for complex order statistics
create or replace function get_order_statistics()
returns jsonb
language plpgsql
security definer
as $$
declare
  total_revenue numeric;
  total_orders int;
  pending_orders int;
  result jsonb;
begin
  select coalesce(sum(total), 0) into total_revenue from orders where payment_status = 'confirmed';
  select count(*) into total_orders from orders;
  select count(*) into pending_orders from orders where order_status = 'processing';
  
  result := jsonb_build_object(
    'total_revenue', total_revenue,
    'total_orders', total_orders,
    'pending_orders', pending_orders
  );
  
  return result;
end;
$$;
