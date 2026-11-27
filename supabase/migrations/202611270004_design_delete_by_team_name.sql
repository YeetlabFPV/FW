create policy fw_delete_design_by_team_name on public.fw_entries
  for delete to authenticated
  using (
    kind = 'design'
    and (select public.fw_team_member())
    and lower(trim(author)) = nullif(lower(trim(
      (select auth.jwt()) -> 'user_metadata' ->> 'fw_design_author'
    )), '')
  );
