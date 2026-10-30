drop trigger if exists product_entities_set_updated_at on public.product_entities;
create trigger product_entities_set_updated_at before update on public.product_entities for each row execute function public.set_updated_at();
drop trigger if exists research_reports_set_updated_at on public.research_reports;
create trigger research_reports_set_updated_at before update on public.research_reports for each row execute function public.set_updated_at();
