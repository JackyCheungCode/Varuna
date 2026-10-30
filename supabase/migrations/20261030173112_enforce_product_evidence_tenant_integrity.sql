alter table public.product_attribute_values drop constraint if exists product_attribute_values_source_tenant_fk;
alter table public.product_attribute_values add constraint product_attribute_values_source_tenant_fk foreign key(evidence_source_id,workspace_id,project_id) references public.evidence_sources(id,workspace_id,project_id) on delete set null (evidence_source_id);
create unique index if not exists evidence_observations_id_workspace_uq on public.evidence_observations(id,workspace_id);
alter table public.product_attribute_values add constraint product_attribute_values_observation_tenant_fk foreign key(evidence_observation_id,workspace_id) references public.evidence_observations(id,workspace_id) on delete set null (evidence_observation_id);
