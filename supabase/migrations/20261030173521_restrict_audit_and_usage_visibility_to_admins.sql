drop policy if exists audit_member_select on public.audit_events;
create policy audit_member_select on public.audit_events for select to authenticated using(public.is_workspace_admin(workspace_id));
drop policy if exists ai_usage_admin_select on public.ai_usage_events;
create policy ai_usage_admin_select on public.ai_usage_events for select to authenticated using(public.is_workspace_admin(workspace_id));
