# Varuna

AI-powered Global Product Intelligence & Product Development Decision Platform.

## Mission
Given a product, product concept, or customer problem, Varuna gathers the broadest relevant lawfully accessible evidence from China and international markets, evaluates its quality and limitations, analyzes demand/customers/competition/technical feasibility/sourcing/economics, and produces evidence-backed product development decisions.

Varuna is not simply an API aggregator or AI report writer. It is a decision system. It must disclose inaccessible sources, missing data, uncertainty, contradictory evidence, and assumptions. It must never imply that all internet data can be accessed or that proxy metrics are measured sales.

## Approved product baseline
- Markets: China and worldwide.
- Scope: category-agnostic; USB Cable is the first validation category, not a hard-coded product type.
- Mode: AI-assisted research with human approval for important findings and decisions.
- Target: professional production platform, extensible to multi-tenant SaaS.

## Technology baseline
- Web: React, TypeScript, Vite on Cloudflare Pages.
- API and server-side integrations: Cloudflare Workers.
- Async jobs: Cloudflare Queues and Workflows.
- Object storage: Cloudflare R2, after account enablement.
- System of record: Supabase Postgres, Auth, and pgvector.

## Documents
- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/DATA-GOVERNANCE.md
- docs/ROADMAP.md
- docs/CONFIGURATION-CENTER.md
- docs/INTELLIGENCE-SOURCES.md
- docs/API-INTELLIGENCE-TAXONOMY.md
- docs/RESEARCH-METHODOLOGY.md
- docs/PRODUCT-BLUEPRINT.md
- docs/CONNECTOR-STATUS.md
- docs/QUICKSTART.md

## Product principles
1. Research is decision-first, multi-source, multilingual, and adaptive to the product and market.
2. Every material finding is traceable to source evidence, collection time, method, and analysis version.
3. Distinguish observed, derived, estimated, inferred, and recommended claims.
4. Triangulate important claims using independent evidence; preserve contradictions and source limitations.
5. Search interest, ranking, views, listings, and review volume are not sales volume.
6. Use official APIs, licensed data, primary research, and permitted methods; comply with provider terms and applicable law.
7. Never expose provider credentials, Supabase service-role credentials, or encryption keys in browser code.
8. Human review is required before important product recommendations become approved decisions.
9. Integrations are organized by intelligence domain, while providers, connectors, evidence types, and access rights remain distinct.

## Current status
Production MVP 0.5.2 is deployed. The application includes authenticated workspaces/projects, encrypted provider configuration, live collectors for YouTube, eBay Browse, DataForSEO, SerpApi and Google Ads Keyword Planner, CSV evidence import, evidence-linked product/attribute extraction, evidence-cited AI reports, sample coverage analytics, and an asynchronous research-task execution path using Cloudflare Queues. Cloudflare Pages and Worker production deployments are active. The owner must still complete the first authenticated end-to-end smoke test and connect eligible provider credentials before relying on live market findings.


## Application scaffold

- Frontend: React 19 + TypeScript + Vite (`src/`), built to `dist/`.
- Cloudflare Pages project: `varuna`, connected to this GitHub repository; production branch remains `main` and feature branches are configured for preview deployments.
- Cloudflare API Worker: `varuna-api`, with authenticated provider configuration/tests, AI planning, collection, product extraction, report generation and queue-consumer endpoints.
- Production app: `https://varuna-cu7.pages.dev`.
- API health: `https://varuna-api.xg-y.workers.dev/api/v1/health` (Worker API v0.5.2).
- Supabase: core schema migration `varuna_core_foundation` has been applied with tenant-scoped RLS tables for workspaces, research projects, provider catalog/connections, research runs/tasks, evidence, claims, and audit events.

### Local development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

### Current implementation boundary

The current MVP supports project creation, authenticated configuration, selected live evidence collectors, CSV evidence import, AI product extraction with source-observation references, sample coverage analysis and evidence-cited AI reports. Research-plan workstreams are mapped only to supported collectors whose credentials have passed connection tests; unsupported or unconfigured workstreams are explicitly marked blocked instead of being presented as completed. Cloudflare Queues dispatches tasks with an encrypted, short-lived user-scoped Supabase access token stored in the EU KV vault; the queue payload contains only a token reference, not the bearer token. Retries, atomic task claiming and a dead-letter queue are configured. Provider credentials are encrypted with AES-GCM and never returned to the browser. This is a bounded research MVP, not universal marketplace coverage: provider eligibility, source rights, sampling bias, quota, and data retention remain visible constraints. Production deployment is active. First-use verification still requires an owner login, production Auth redirect allowlist confirmation, and a successful provider connection/collection smoke test.
