create index if not exists product_attribute_values_evidence_observation_idx on public.product_attribute_values(evidence_observation_id);
create index if not exists product_attribute_values_evidence_source_idx on public.product_attribute_values(evidence_source_id);
create index if not exists product_attribute_values_project_id_idx on public.product_attribute_values(project_id);
create index if not exists product_attribute_values_product_tenant_idx on public.product_attribute_values(product_id,workspace_id,project_id);
create index if not exists product_attribute_values_source_tenant_idx on public.product_attribute_values(evidence_source_id,workspace_id,project_id);
create index if not exists product_attribute_values_observation_tenant_idx on public.product_attribute_values(evidence_observation_id,workspace_id);

drop policy if exists projects_member_insert on public.research_projects;
create policy projects_member_insert on public.research_projects for insert to authenticated with check(private.is_workspace_member(workspace_id) and created_by=(select auth.uid()));
drop policy if exists runs_member_all on public.research_runs;
create policy runs_member_all on public.research_runs for all to authenticated using(private.is_workspace_member(workspace_id)) with check(private.is_workspace_member(workspace_id) and created_by=(select auth.uid()));
drop policy if exists audit_member_insert on public.audit_events;
create policy audit_member_insert on public.audit_events for insert to authenticated with check(private.is_workspace_member(workspace_id) and actor_id=(select auth.uid()));
drop policy if exists provider_connections_admin_insert on public.provider_connections;
create policy provider_connections_admin_insert on public.provider_connections for insert to authenticated with check(private.is_workspace_admin(workspace_id) and created_by=(select auth.uid()));
drop policy if exists ai_routes_admin_insert on public.ai_task_routes;
create policy ai_routes_admin_insert on public.ai_task_routes for insert to authenticated with check(private.is_workspace_admin(workspace_id) and created_by=(select auth.uid()));
