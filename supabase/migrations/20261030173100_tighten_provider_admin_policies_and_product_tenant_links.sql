create or replace function public.is_workspace_admin(p_workspace_id uuid)
returns boolean language sql stable security definer set search_path=public,auth
as $$ select exists(select 1 from public.workspace_members wm where wm.workspace_id=p_workspace_id and wm.user_id=auth.uid() and wm.role in ('owner','admin')); $$;
revoke all on function public.is_workspace_admin(uuid) from public;
grant execute on function public.is_workspace_admin(uuid) to authenticated;
drop policy if exists provider_connections_admin_insert on public.provider_connections;
drop policy if exists provider_connections_admin_update on public.provider_connections;
create policy provider_connections_admin_insert on public.provider_connections for insert to authenticated with check(public.is_workspace_admin(workspace_id) and created_by=auth.uid());
create policy provider_connections_admin_update on public.provider_connections for update to authenticated using(public.is_workspace_admin(workspace_id)) with check(public.is_workspace_admin(workspace_id));
drop policy if exists ai_routes_admin_insert on public.ai_task_routes;
drop policy if exists ai_routes_admin_update on public.ai_task_routes;
create policy ai_routes_admin_insert on public.ai_task_routes for insert to authenticated with check(public.is_workspace_admin(workspace_id) and created_by=auth.uid());
create policy ai_routes_admin_update on public.ai_task_routes for update to authenticated using(public.is_workspace_admin(workspace_id)) with check(public.is_workspace_admin(workspace_id));
create unique index if not exists evidence_sources_id_workspace_project_uq on public.evidence_sources(id,workspace_id,project_id);
create unique index if not exists product_entities_id_workspace_project_uq on public.product_entities(id,workspace_id,project_id);
alter table public.product_attribute_values add constraint product_attribute_values_product_tenant_fk foreign key(product_id,workspace_id,project_id) references public.product_entities(id,workspace_id,project_id) on delete cascade;
alter table public.product_attribute_values add constraint product_attribute_values_source_tenant_fk foreign key(evidence_source_id,workspace_id,project_id) references public.evidence_sources(id,workspace_id,project_id) on delete set null;
