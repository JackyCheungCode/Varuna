create unique index if not exists research_projects_id_workspace_uq on public.research_projects(id,workspace_id);
create table if not exists public.research_reports (
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.workspaces(id) on delete cascade,
 project_id uuid not null,
 title text not null,
 status text not null default 'draft' check(status in ('draft','generated','reviewed','archived')),
 report_content jsonb not null default '{}'::jsonb,
 methodology jsonb not null default '{}'::jsonb,
 coverage jsonb not null default '{}'::jsonb,
 evidence_snapshot jsonb not null default '{}'::jsonb,
 created_by uuid not null,
 generated_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 foreign key(project_id,workspace_id) references public.research_projects(id,workspace_id) on delete cascade
);
create index if not exists research_reports_workspace_project_idx on public.research_reports(workspace_id,project_id,created_at desc);
alter table public.research_reports enable row level security;
create policy research_reports_member_select on public.research_reports for select to authenticated using(private.is_workspace_member(workspace_id));
create policy research_reports_researcher_insert on public.research_reports for insert to authenticated with check(private.is_workspace_researcher(workspace_id) and created_by=(select auth.uid()));
create policy research_reports_researcher_update on public.research_reports for update to authenticated using(private.is_workspace_researcher(workspace_id)) with check(private.is_workspace_researcher(workspace_id));
create policy research_reports_researcher_delete on public.research_reports for delete to authenticated using(private.is_workspace_researcher(workspace_id));
