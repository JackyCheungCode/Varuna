-- Tenant-safe membership predicate; SECURITY DEFINER avoids recursive workspace_members RLS.
create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean language sql stable security definer set search_path = public, auth
as $$ select exists (select 1 from public.workspace_members wm where wm.workspace_id=p_workspace_id and wm.user_id=auth.uid()); $$;
revoke all on function public.is_workspace_member(uuid) from public;
grant execute on function public.is_workspace_member(uuid) to authenticated;

drop policy if exists projects_member_select on public.research_projects;
drop policy if exists projects_member_insert on public.research_projects;
drop policy if exists projects_member_update on public.research_projects;
create policy projects_member_select on public.research_projects for select to authenticated using (public.is_workspace_member(workspace_id));
create policy projects_member_insert on public.research_projects for insert to authenticated with check (public.is_workspace_member(workspace_id) and created_by=auth.uid());
create policy projects_member_update on public.research_projects for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

drop policy if exists provider_connections_member_select on public.provider_connections;
drop policy if exists provider_connections_admin_insert on public.provider_connections;
drop policy if exists provider_connections_admin_update on public.provider_connections;
create policy provider_connections_member_select on public.provider_connections for select to authenticated using (public.is_workspace_member(workspace_id));
create policy provider_connections_admin_insert on public.provider_connections for insert to authenticated with check (public.is_workspace_member(workspace_id) and created_by=auth.uid());
create policy provider_connections_admin_update on public.provider_connections for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

drop policy if exists runs_member_all on public.research_runs;
create policy runs_member_all on public.research_runs for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id) and created_by=auth.uid());
drop policy if exists tasks_member_all on public.research_tasks;
create policy tasks_member_all on public.research_tasks for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists evidence_sources_member_all on public.evidence_sources;
create policy evidence_sources_member_all on public.evidence_sources for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists evidence_observations_member_all on public.evidence_observations;
create policy evidence_observations_member_all on public.evidence_observations for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists claims_member_all on public.claims;
create policy claims_member_all on public.claims for all to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists audit_member_select on public.audit_events;
create policy audit_member_select on public.audit_events for select to authenticated using (public.is_workspace_member(workspace_id));
create policy audit_member_insert on public.audit_events for insert to authenticated with check (public.is_workspace_member(workspace_id) and actor_id=auth.uid());
drop policy if exists ai_routes_member_select on public.ai_task_routes;
drop policy if exists ai_routes_admin_insert on public.ai_task_routes;
drop policy if exists ai_routes_admin_update on public.ai_task_routes;
create policy ai_routes_member_select on public.ai_task_routes for select to authenticated using (public.is_workspace_member(workspace_id));
create policy ai_routes_admin_insert on public.ai_task_routes for insert to authenticated with check (public.is_workspace_member(workspace_id) and created_by=auth.uid());
create policy ai_routes_admin_update on public.ai_task_routes for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
drop policy if exists ai_usage_admin_select on public.ai_usage_events;
create policy ai_usage_admin_select on public.ai_usage_events for select to authenticated using (public.is_workspace_member(workspace_id));
create policy ai_usage_member_insert on public.ai_usage_events for insert to authenticated with check (public.is_workspace_member(workspace_id));

create table if not exists public.product_entities (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id) on delete cascade,
 project_id uuid not null references public.research_projects(id) on delete cascade,
 canonical_name text not null check(char_length(canonical_name) between 2 and 300),
 brand text, model_number text, gtin text, mpn text, category text, canonical_url text,
 identity_key text not null, identity_method text not null default 'normalized_name',
 identity_confidence numeric(5,4) check(identity_confidence between 0 and 1),
 attributes jsonb not null default '{}'::jsonb,
 first_observed_at timestamptz not null default now(), last_observed_at timestamptz not null default now(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(project_id,identity_key)
);
create index if not exists product_entities_workspace_project_idx on public.product_entities(workspace_id,project_id);
create index if not exists product_entities_brand_model_idx on public.product_entities(project_id,brand,model_number);
create index if not exists product_entities_gtin_idx on public.product_entities(project_id,gtin) where gtin is not null;

create table if not exists public.product_attribute_values (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id) on delete cascade,
 project_id uuid not null references public.research_projects(id) on delete cascade,
 product_id uuid not null references public.product_entities(id) on delete cascade,
 attribute_key text not null, value_text text, value_numeric numeric, unit text, normalized_value jsonb,
 evidence_source_id uuid references public.evidence_sources(id) on delete set null,
 evidence_observation_id uuid references public.evidence_observations(id) on delete set null,
 extraction_method text not null default 'manual',
 confidence numeric(5,4) check(confidence between 0 and 1),
 verification_status text not null default 'unverified' check(verification_status in ('unverified','corroborated','verified','disputed','rejected')),
 observed_at timestamptz not null default now(), created_at timestamptz not null default now(),
 check(value_text is not null or value_numeric is not null or normalized_value is not null)
);
create index if not exists product_attribute_values_product_key_idx on public.product_attribute_values(product_id,attribute_key);
create index if not exists product_attribute_values_workspace_project_idx on public.product_attribute_values(workspace_id,project_id);
alter table public.product_entities enable row level security;
alter table public.product_attribute_values enable row level security;
create policy product_entities_member_all on public.product_entities for all to authenticated using(public.is_workspace_member(workspace_id)) with check(public.is_workspace_member(workspace_id));
create policy product_attribute_values_member_all on public.product_attribute_values for all to authenticated using(public.is_workspace_member(workspace_id)) with check(public.is_workspace_member(workspace_id));
