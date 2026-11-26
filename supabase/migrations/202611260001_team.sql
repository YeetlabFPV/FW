create table public.fw_members (
  email text primary key check (email = lower(btrim(email)))
);
alter table public.fw_members enable row level security;
revoke all on public.fw_members from anon, authenticated;

create function public.fw_team_member()
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1 from public.fw_members where email = lower(auth.jwt()->>'email')
  );
$$;
revoke all on function public.fw_team_member() from public;
grant execute on function public.fw_team_member() to authenticated;

create table public.fw_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author text not null check (length(btrim(author)) between 1 and 100),
  title text not null check (length(btrim(title)) between 1 and 140),
  kind text not null check (kind in ('design', 'rendering')),
  source text check (source in ('AI', 'Blender')),
  design_id uuid references public.fw_entries(id) on delete set null,
  created_at timestamptz not null default now(),
  payload jsonb,
  image_data text,
  mime text,
  check (
    (kind = 'design' and (payload->>'format' = 'fw-3d-materials') is true
      and (payload->>'version' = '1') is true
      and octet_length(payload::text) <= 200000
      and design_id is null and image_data is null and mime is null and source is null)
    or
    (kind = 'rendering' and payload is null and source is not null
      and (mime in ('image/jpeg','image/png','image/webp')) is true
      and image_data is not null and length(image_data) between 32 and 5592408
      and image_data ~ '^[A-Za-z0-9+/]+={0,2}$')
  )
);
create index fw_entries_owner_idx on public.fw_entries(owner_id);
create index fw_entries_created_idx on public.fw_entries(created_at desc);
create index fw_entries_design_idx on public.fw_entries(design_id) where design_id is not null;
alter table public.fw_entries enable row level security;
revoke all on public.fw_entries from anon, authenticated;
grant select, delete on public.fw_entries to authenticated;
grant insert (kind, author, title, source, design_id, payload, image_data, mime) on public.fw_entries to authenticated;
create policy fw_read_team on public.fw_entries for select to authenticated
  using ((select public.fw_team_member()));
create policy fw_insert_own on public.fw_entries for insert to authenticated
  with check ((select public.fw_team_member()) and owner_id = (select auth.uid()));
create policy fw_delete_own on public.fw_entries for delete to authenticated
  using ((select public.fw_team_member()) and owner_id = (select auth.uid()));
