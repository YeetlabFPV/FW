alter policy fw_update_design on public.fw_entries to authenticated
  using (
    kind = 'design' and owner_id = (select auth.uid())
    and ((select public.fw_team_member()) or (select public.fw_is_admin()))
  )
  with check (
    kind = 'design' and owner_id = (select auth.uid())
    and ((select public.fw_team_member()) or (select public.fw_is_admin()))
  );
