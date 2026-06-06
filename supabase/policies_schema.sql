-- AETHEX STORE - Policies Table Schema
create table if not exists policies (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  content jsonb not null,
  is_active boolean default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table policies enable row level security;

-- Drop policy if exists
drop policy if exists "Allow public read access to policies" on policies;

-- Public read access policy
create policy "Allow public read access to policies"
on policies for select
to public
using (true);
