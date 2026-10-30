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
Product-foundation stage. Research methodology, requirements, source strategy, and architecture are being established before production data collection or deployment.


## Application scaffold

- Frontend: React 19 + TypeScript + Vite (`src/`), built to `dist/`.
- Cloudflare Pages project: `varuna`, connected to this GitHub repository; production branch remains `main` and feature branches are configured for preview deployments.
- Cloudflare API Worker: `varuna-api`, with health and provider-catalog endpoints.
- API health: `https://varuna-api.xg-y.workers.dev/api/v1/health`.
- Supabase: core schema migration `varuna_core_foundation` has been applied with tenant-scoped RLS tables for workspaces, research projects, provider catalog/connections, research runs/tasks, evidence, claims, and audit events.

### Local development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

### Current implementation boundary

The initial UI and infrastructure scaffold are in place. Authentication screens, persistent workspace/project CRUD, asynchronous task consumers, live marketplace/search/social/supplier collection adapters, evidence normalization and evaluation, AI task routing, report generation, and production hardening remain implementation work. The Worker now supports authenticated AI text generation and AI-assisted research plan creation; plans are persisted as research runs with queued workstream tasks. Provider credentials can now be submitted through the authenticated Worker API, encrypted with AES-GCM, and stored in an EU-jurisdiction KV namespace; only connection metadata is exposed to the browser. Enter provider credentials only through the authenticated Configuration Center after signing in. Complex OAuth providers may require a JSON object with the provider's documented credential fields. Connection status is only marked connected after a successful provider-specific test. No provider is considered connected until an actual connection test succeeds.
