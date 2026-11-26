create table public.fw_gallery_removed (
  path text primary key check (length(path) between 1 and 255)
);
alter table public.fw_gallery_removed enable row level security;
revoke all on public.fw_gallery_removed from anon, authenticated;
grant select on public.fw_gallery_removed to anon, authenticated;
grant insert on public.fw_gallery_removed to authenticated;
create policy gallery_read on public.fw_gallery_removed for select to anon, authenticated using (true);
create policy gallery_remove on public.fw_gallery_removed for insert to authenticated
  with check ((select public.fw_is_admin()));
