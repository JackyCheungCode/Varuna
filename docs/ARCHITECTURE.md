# Varuna Technical Architecture

Status: Approved baseline | Date: 2026-10-30

## System topology
Browser -> Cloudflare Pages (React + TypeScript + Vite) -> Cloudflare Worker API (authentication, authorization, validation, orchestration).

Worker API connects to:
- Queues for independently retryable collection and review-analysis units.
- Workflows for resumable multi-stage research and approval waits.
- AI providers through a replaceable model router / AI Gateway.
- Supabase Auth and Postgres for identity and system-of-record data.
- R2 for large raw snapshots, exports, and artifacts after account enablement.

## Responsibility boundaries
### Cloudflare Pages
Hosts the web application. Browser code may contain the Supabase publishable key and public URL, but never service-role keys, provider credentials, encryption keys, or privileged Worker secrets.

### Cloudflare Workers
Owns APIs, authorization, connector execution, provider secrets, AI calls, signed object access, and job submission. Validate Supabase access tokens and organization membership before accessing tenant data. Prefer user-scoped database requests; privileged operations must be narrow, audited, and server-only.

### Queues and Workflows
Queues handle independently retryable units such as source pages, product records, and review batches. Workflows coordinate long-running research stages. Use idempotency keys, bounded retries, backoff, poison-message handling, and a dead-letter strategy. Never run a whole market study in one HTTP request.

### R2
Stores large raw source payloads, snapshots, exports, and intermediate artifacts when enabled. Postgres stores metadata, ownership, retention, checksums, and object keys. R2 is not a relational query store.

### Supabase
Postgres is the system of record for organizations, research projects, canonical product entities, source observations, reviews, analysis outputs, evidence, and reports. Supabase Auth manages identity. RLS protects exposed tables. pgvector supports semantic retrieval and clustering where useful.

## Target repository layout
- apps/web: React/Vite Pages frontend.
- apps/api: Cloudflare Worker HTTP API.
- apps/jobs: Queue consumers and Workflow definitions (may share a Worker initially).
- packages/contracts: validated DTOs and event contracts.
- packages/domain: pure domain logic and normalization.
- packages/connectors: provider adapter interfaces and implementations.
- packages/ai: model router, prompt versions, structured output validators.
- packages/ui: shared design system.
- supabase/migrations and supabase/seed: reviewed schema and synthetic fixtures.
- docs and .github/workflows: documentation and CI.

Keep initial deployment small: one web app and one API/worker deployment. Split job consumers only when scaling or isolation justifies it.

## Data architecture
Canonical entities: product, variant, brand, category, attribute definition/value. Source entities: provider, source listing, source record, collection job, observation. Consumer entities: review, review aspect/topic, sentiment, pain point, need. Research entities: project, plan, task, analysis run, evidence, opportunity, concept, specification, report. Governance entities: organization, membership, role, credential reference, audit event, usage ledger, retention policy.

Every external record includes provider/source ID, collected_at, source URL/reference when permitted, locale, raw-object reference/checksum where applicable, normalizer version, and quality status.

Use UUID keys, foreign keys, check constraints, targeted indexes, UTC timestamps, ISO currency codes, and explicit unit codes. JSONB is for provider-specific/evolving payloads, not a substitute for queryable core columns. Partition only after measuring volume and query patterns.

## Product attribute model
Use category taxonomy plus attribute definitions: key, category scope, display name, data type, canonical unit, allowed values, validation schema, localized labels, and version. Values preserve raw_value, normalized_value, unit, source, observed_at, extraction method, confidence, and verification status. Do not hard-code USB Cable attributes as global columns.

## Review analytics
Keep source reviews separate from derived analysis. Store review text only where source terms and law permit. Derived aspect/topic labels, sentiment, pain points, needs, and evidence spans reference review and model/prompt/schema version. Aggregates include denominator, time range, source mix, language mix, and filtering rules.

Pipeline: ingest -> deduplicate -> language detect -> batch -> structured extraction -> validate -> persist -> aggregate. Avoid unbounded model requests. Use labeled evaluation sets to measure quality.

## AI architecture
Use provider interfaces and model-routing policy, not model-specific calls in business services. Logical capabilities: planner, market analyst, product analyst, review analyst, competitor analyst, opportunity analyst, product concept analyst, report writer. Initially these may be a small number of orchestrated services.

Require schema-constrained outputs, prompt/model versioning, token/cost tracking, retry limits, PII minimization, and human approval gates. Findings link to evidence IDs and distinguish observed facts, estimates, inferences, and recommendations.

## Security
- Secrets only in Worker secrets or approved secret storage; never in Vite variables.
- Supabase publishable key is public by design; service-role key is never sent to browser.
- Enable RLS on every exposed table and write tenant-aware policies; test cross-tenant access.
- Encrypt provider credentials at rest; restrict decrypt/use to server runtime.
- Use least privilege, rotation, redaction, audit events, and per-provider spend limits.
- Validate webhook signatures and external payloads.
- Apply source-specific privacy, copyright, retention, and deletion policies.
- Do not deploy unreviewed schema changes to a live project.

## Environments and deployment
Local uses mocked providers and synthetic fixtures. Preview uses isolated data and non-production credentials. Production uses separate credentials, reviewed migrations, monitoring, backups, retention, and rollback. CI runs install from lockfile, lint, typecheck, tests, build, migration checks, and dependency/security checks. Pages deploys web; Workers deploy API/jobs.

## Decisions
Supabase Postgres is primary relational store for analytics, RLS, and vector search. R2 is raw-data/object layer and must be enabled before use. Queues handle fan-out; Workflows coordinate durable research. Existing Pages projects and Queues are not assumed to belong to Varuna and must not be repurposed.
