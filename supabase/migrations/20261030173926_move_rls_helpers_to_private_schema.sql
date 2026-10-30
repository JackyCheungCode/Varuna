create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
alter function public.is_workspace_member(uuid) set schema private;
alter function public.is_workspace_admin(uuid) set schema private;
alter function public.is_workspace_researcher(uuid) set schema private;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.is_workspace_admin(uuid) to authenticated;
grant execute on function private.is_workspace_researcher(uuid) to authenticated;
