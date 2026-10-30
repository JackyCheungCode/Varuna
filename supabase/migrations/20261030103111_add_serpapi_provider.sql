insert into public.provider_catalog
  (id, domain_code, name, category, capabilities, access_class, documentation_url, eligibility_notes, enabled)
values
  ('serpapi','D02','SerpApi','Search data',
   array['web_search','shopping','news','maps','trends'],
   'licensed','https://serpapi.com/search-api',
   'SerpApi API key and plan quota required; engine coverage, commercial reuse, retention and source-platform terms must be verified.',
   true)
on conflict (id) do update set
  domain_code=excluded.domain_code,
  name=excluded.name,
  category=excluded.category,
  capabilities=excluded.capabilities,
  access_class=excluded.access_class,
  documentation_url=excluded.documentation_url,
  eligibility_notes=excluded.eligibility_notes,
  enabled=excluded.enabled;
