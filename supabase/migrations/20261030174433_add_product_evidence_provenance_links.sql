create table if not exists public.product_evidence_links (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id) on delete cascade,
 project_id uuid not null references public.research_projects(id) on delete cascade,
 product_id uuid not null,
 evidence_source_id uuid,
 evidence_observation_id uuid,
 relationship text not null default 'identified_from' check(relationship in ('identified_from','attribute_support','identity_match','corroborates','contradicts')),
 confidence numeric(5,4) check(confidence between 0 and 1),
 created_at timestamptz not null default now(),
 unique(product_id,evidence_observation_id,relationship),
 foreign key(product_id,workspace_id,project_id) references public.product_entities(id,workspace_id,project_id) on delete cascade,
 foreign key(evidence_source_id,workspace_id,project_id) references public.evidence_sources(id,workspace_id,project_id) on delete set null (evidence_source_id),
 foreign key(evidence_observation_id,workspace_id) references public.evidence_observations(id,workspace_id) on delete set null (evidence_observation_id)
);
create index if not exists product_evidence_links_product_idx on public.product_evidence_links(product_id);
create index if not exists product_evidence_links_source_idx on public.product_evidence_links(evidence_source_id);
create index if not exists product_evidence_links_observation_idx on public.product_evidence_links(evidence_observation_id);
create index if not exists product_evidence_links_product_tenant_idx on public.product_evidence_links(product_id,workspace_id,project_id);
create index if not exists product_evidence_links_source_tenant_idx on public.product_evidence_links(evidence_source_id,workspace_id,project_id);
create index if not exists product_evidence_links_observation_tenant_idx on public.product_evidence_links(evidence_observation_id,workspace_id);
alter table public.product_evidence_links enable row level security;
create policy product_evidence_links_member_select on public.product_evidence_links for select to authenticated using(private.is_workspace_member(workspace_id));
create policy product_evidence_links_researcher_insert on public.product_evidence_links for insert to authenticated with check(private.is_workspace_researcher(workspace_id));
create policy product_evidence_links_researcher_update on public.product_evidence_links for update to authenticated using(private.is_workspace_researcher(workspace_id)) with check(private.is_workspace_researcher(workspace_id));
create policy product_evidence_links_researcher_delete on public.product_evidence_links for delete to authenticated using(private.is_workspace_researcher(workspace_id));
