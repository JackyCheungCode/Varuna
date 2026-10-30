create or replace function public.is_workspace_researcher(p_workspace_id uuid)
returns boolean language sql stable security definer set search_path=public,auth
as $$ select exists(select 1 from public.workspace_members wm where wm.workspace_id=p_workspace_id and wm.user_id=auth.uid() and wm.role in ('owner','admin','researcher')); $$;
revoke all on function public.is_workspace_researcher(uuid) from public;
grant execute on function public.is_workspace_researcher(uuid) to authenticated;
drop policy if exists product_entities_member_all on public.product_entities;
create policy product_entities_member_select on public.product_entities for select to authenticated using(public.is_workspace_member(workspace_id));
create policy product_entities_researcher_insert on public.product_entities for insert to authenticated with check(public.is_workspace_researcher(workspace_id));
create policy product_entities_researcher_update on public.product_entities for update to authenticated using(public.is_workspace_researcher(workspace_id)) with check(public.is_workspace_researcher(workspace_id));
create policy product_entities_researcher_delete on public.product_entities for delete to authenticated using(public.is_workspace_researcher(workspace_id));
drop policy if exists product_attribute_values_member_all on public.product_attribute_values;
create policy product_attribute_values_member_select on public.product_attribute_values for select to authenticated using(public.is_workspace_member(workspace_id));
create policy product_attribute_values_researcher_insert on public.product_attribute_values for insert to authenticated with check(public.is_workspace_researcher(workspace_id));
create policy product_attribute_values_researcher_update on public.product_attribute_values for update to authenticated using(public.is_workspace_researcher(workspace_id)) with check(public.is_workspace_researcher(workspace_id));
create policy product_attribute_values_researcher_delete on public.product_attribute_values for delete to authenticated using(public.is_workspace_researcher(workspace_id));
