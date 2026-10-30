# Varuna

AI-powered Global Product Intelligence Platform.

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

## Product principles
1. Every material finding is traceable to source evidence, collection time, and analysis version.
2. Estimates are labeled; search interest, ranking, and review volume are not sales volume.
3. Use official APIs, licensed data, and permitted collection methods; comply with provider terms and applicable law.
4. Never expose provider credentials, Supabase service-role credentials, or encryption keys in browser code.
5. Human review is required before important product recommendations become approved decisions.
6. Routine provider configuration is managed in the frontend; credentials are encrypted and used server-side only.
7. Organize integrations by intelligence domain, while keeping providers, connectors, evidence types, and access rights distinct.

## Current status
Product-foundation stage. Requirements and architecture are being established before production data collection or deployment.
