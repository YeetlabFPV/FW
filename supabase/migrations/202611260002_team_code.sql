-- Configure the PIN hash in fw_team_code and the verified administrator in fw_members separately.
begin;

create extension if not exists pgcrypto with schema extensions;

create table public.fw_team_code (
  singleton boolean primary key default true check (singleton),
  code_hash bytea not null,
  attempts integer not null default 0,
  window_start timestamptz not null default now()
);
create table public.fw_browser_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.fw_team_code enable row level security;
alter table public.fw_browser_members enable row level security;
revoke all on public.fw_team_code, public.fw_browser_members from public, anon, authenticated;

create or replace function public.fw_team_member()
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and (
    exists (select 1 from public.fw_members where email = lower(auth.jwt()->>'email'))
    or exists (select 1 from public.fw_browser_members where user_id = auth.uid())
  );
$$;

create function public.fw_join_team(team_code text)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare entry public.fw_team_code%rowtype;
begin
  if auth.uid() is null or team_code is null or team_code !~ '^[0-9]{4}$' then
    return false;
  end if;
  if public.fw_team_member() then return true; end if;
  select * into entry from public.fw_team_code where singleton for update;
  if not found then return false; end if;
  if entry.window_start < now() - interval '1 hour' then
    update public.fw_team_code set attempts=0, window_start=now() where singleton;
    entry.attempts:=0;
  end if;
  if entry.attempts >= 5 then return false; end if;
  if entry.code_hash <> extensions.digest(team_code, 'sha256') then
    update public.fw_team_code set attempts=attempts+1 where singleton;
    return false;
  end if;
  insert into public.fw_browser_members(user_id) values (auth.uid()) on conflict do nothing;
  return true;
end;
$$;

revoke all on function public.fw_join_team(text) from public, anon;
grant execute on function public.fw_join_team(text) to authenticated;

drop policy fw_read_team on public.fw_entries;
grant select on public.fw_entries to anon;
create policy fw_read_public on public.fw_entries for select to anon, authenticated using (true);

alter table public.fw_members add column admin boolean not null default false;

create function public.fw_is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email_confirmed_at is not null
      and exists (select 1 from public.fw_members m where m.email = lower(auth.users.email) and m.admin)
  );
$$;
revoke all on function public.fw_is_admin() from public, anon;
grant execute on function public.fw_is_admin() to authenticated;
create policy fw_delete_admin on public.fw_entries for delete to authenticated
  using ((select public.fw_is_admin()));

create policy fw_insert_admin on public.fw_entries for insert to authenticated
  with check ((select public.fw_is_admin()) and owner_id = (select auth.uid()));

commit;
