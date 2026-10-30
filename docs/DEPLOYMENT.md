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

## Preview / production policy

The GitHub development branch is used for Pages preview builds. The production branch remains `main`; do not promote an unreviewed preview to production. Confirm build success, API health, authentication, RLS, provider credential encryption, and backup/restore before production promotion.

## Required server-side configuration (not yet enabled)

- Supabase project URL and publishable/anon key for authenticated client flows.
- A server-only service credential or a narrowly scoped alternative for trusted backend operations.
- A high-entropy credential encryption key, stored as a Cloudflare Worker secret.
- Provider API keys entered only after the credential vault endpoint and encryption tests are implemented.

Never commit secrets or paste provider credentials into browser local storage. Never expose Supabase service-role credentials in Pages build variables or client bundles.
