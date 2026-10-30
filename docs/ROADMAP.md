# Varuna Delivery Roadmap

Baseline date: 2026-10-30. Delivery uses vertical slices and explicit acceptance gates.

## Milestone 0 — Product and repository foundation
- [x] Confirm China + global market scope.
- [x] Confirm category-agnostic product scope.
- [x] Confirm AI-assisted automation with human approval.
- [x] Establish PRD, architecture, and data-governance baseline.
- [ ] Add application scaffold, CI, and local development instructions.
- [ ] Review environments and establish isolated Varuna resources.

Exit gate: docs reviewed; repository conventions, environment boundaries, and CI checks agreed.

## Milestone 1 — Secure application shell
- Complete the intelligence source/API/AI selection matrix and provider eligibility/contract review before connector implementation.
- Add Settings > Integrations with provider catalog, dynamic forms, masked credential state, server-side test connection, enable/disable, and audit history.
- Add encrypted credential persistence, key versioning/rotation contract, Owner/Admin authorization, redaction, and cross-tenant tests.
- Add model routing by capability, fallback order, budget/timeout controls, and connector market/locale scope.
- React/Vite web app and responsive navigation.
- Cloudflare Worker API with health/version endpoints.
- Supabase Auth and organization-aware authorization.
- Initial migrations for organizations, memberships, projects, audit events.
- RLS tests, typed contracts, lint/typecheck/build CI.

Exit gate: authenticated user creates/views an isolated research project in preview; cross-tenant tests pass.

## Milestone 2 — First connector and normalized catalog
- Connector interface and registry.
- Start with one search or licensed product-data provider selected by available credentials and terms.
- Collection jobs, raw payload metadata, product/listing/variant model, provenance.
- Idempotent Queue consumer and retry/dead-letter handling.

Exit gate: reproducible sample collection creates normalized product records and source-linked observations.

## Milestone 3 — Review intelligence
- Authorized review source or user-uploaded dataset.
- Language detection, deduplication, aspect/topic/sentiment/pain-point extraction.
- Batch processing and cost controls.
- Human labeling and quality evaluation.

Exit gate: bounded review dataset analyzed with reproducible denominators, evidence spans, and measured quality.

## Milestone 4 — End-to-end research report
- Research planner and durable workflow.
- Product/competitor comparison.
- Opportunity hypotheses with supporting and contradicting evidence.
- Editable product concept/specification and report versioning.

Exit gate: USB Cable research journey works with real authorized data or clearly labeled fixtures.

## Milestone 5 — Multi-market expansion and operations
- China and international connector expansion.
- Currency/unit normalization and localization.
- Budgets, observability, retention, exports, backups, disaster recovery.
- Performance and security review.

Exit gate: production readiness review completed; no unresolved critical security or governance findings.

## Delivery rules
- Never deploy unreviewed schema changes to production.
- Never enable a connector without source-policy review and credentials.
- Never report sales volume without a defensible measurement source.
- Every milestone has CI evidence and rollback path.
- Do not repurpose unrelated Cloudflare Pages projects or Queues.
