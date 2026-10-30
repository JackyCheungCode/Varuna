# Varuna Deployment

## Cloudflare resources

- Pages project: `varuna`
- Pages hostname: `varuna-cu7.pages.dev`
- Pages source: GitHub `JackyCheungCode/Varuna`
- Production branch: `main`
- Preview branches: all branches
- Build command: `npm run build`
- Build output: `dist`
- API Worker: `varuna-api`
- API hostname: `https://varuna-api.xg-y.workers.dev`

## Supabase

- Project ref: `dnvcmvfexaucyjlvtvbm`
- Region: `eu-west-1`
- Migration: `varuna_core_foundation`
- The migration establishes workspace-scoped RLS tables and a private schema for encrypted provider credential payloads. The private credential table is not directly granted to browser roles.

## Background processing and object storage

- Queues created in EU jurisdiction: `varuna-research-tasks` and `varuna-research-tasks-dlq`.
- Worker producer binding: `RESEARCH_TASKS`.
- Queue consumers are not activated yet; current research workstream tasks remain in Supabase until the durable task processor and provider-specific consumers are implemented.
- R2 is not enabled on this Cloudflare account (Cloudflare API returned 403 requiring dashboard enablement). Raw artifact storage and report object storage remain pending; do not assume R2 is available.

## Preview / production policy

The GitHub development branch is used for Pages preview builds. The production branch remains `main`; do not promote an unreviewed preview to production. Confirm build success, API health, authentication, RLS, provider credential encryption, and backup/restore before production promotion.

## Credential vault

- Cloudflare KV namespace: `varuna-provider-secrets` (EU jurisdiction).
- Worker secret binding: `CREDENTIAL_ENCRYPTION_KEY` (random 256-bit key, AES-GCM).
- Worker bindings: `PROVIDER_SECRETS`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- Authenticated API endpoints:
  - `GET /api/v1/providers?workspace_id=...`
  - `POST /api/v1/providers` to encrypt and save provider credentials.
  - `POST /api/v1/providers/{provider_id}/test` to validate supported credentials.
  - `POST /api/v1/ai/generate` to run a configured model for a workspace task.
  - `POST /api/v1/projects/{project_id}/plan` to generate an evidence-led research plan and persist a run plus queued workstream tasks.
  - `POST /api/v1/collect/youtube` to collect authorized YouTube video metadata and engagement observations.
  - `POST /api/v1/collect/ebay` to collect eBay Browse listing observations.
  - `POST /api/v1/collect/serp` to collect licensed DataForSEO Google organic SERP snapshots.
- Credentials are never returned to the browser. The database stores only a KV reference and non-secret connection metadata. KV values contain authenticated AES-GCM ciphertext.

## Current provider validation coverage

Automatic validation is implemented for OpenAI, Anthropic, Gemini, DeepSeek, YouTube Data API, DataForSEO (username/password JSON), eBay OAuth client credentials, and Reddit OAuth client credentials. Other provider entries can be securely saved but remain `configured` until their specific authorization, signing, eligibility, and test adapter is implemented. A saved key does not mean the provider is connected.

Never commit secrets or paste provider credentials into browser local storage. Never expose Supabase service-role credentials in Pages build variables or client bundles.
