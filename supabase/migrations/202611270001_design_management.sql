begin;
grant update (payload) on public.fw_entries to authenticated;
create policy fw_update_design on public.fw_entries for update to authenticated
  using (
    kind = 'design' and (
      ((select public.fw_team_member()) and owner_id = (select auth.uid()))
      or (select public.fw_is_admin())
    )
  )
  with check (
    kind = 'design' and (
      ((select public.fw_team_member()) and owner_id = (select auth.uid()))
      or (select public.fw_is_admin())
    )
  );
commit;
