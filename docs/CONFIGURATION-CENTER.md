# Varuna Configuration Center

Status: Product requirement | Version: 0.1 | Date: 2026-10-30

## Purpose

All provider and model configuration must be manageable from the authenticated Varuna web UI. An Owner/Admin must not need to edit source code, Wrangler files, deployment variables, or database rows to add, test, enable, disable, or rotate an integration during normal operation.

This is a configuration-management interface, not a browser-side integration runtime. The browser sends credentials only over authenticated TLS to the Varuna Worker API. The Worker validates and encrypts them before persistence; provider calls are made server-side.

## Configuration families

1. AI/model providers: Workers AI, OpenAI-compatible APIs, Anthropic, Google Gemini, and additional providers through adapters. Fields are provider-specific: base URL (only where supported), API key, organization/project identifiers, default model, embedding model, supported capabilities, timeout, and optional routing priority.
2. Search and web research: search API vendor, API key, region/market, locale, safe-search or result settings where applicable, quota and rate limits.
3. Marketplace/product data: provider credentials, region/site, API scopes, permitted entities/endpoints, attribution, plan/quotas, and source policy metadata.
4. Reviews/social/community: authorized provider or import configuration, region/language coverage, allowed fields, retention policy, and batch limits.
5. Company/contact enrichment: vendor credentials, permitted enrichment fields, geographic coverage, per-request limits, and privacy constraints.
6. Infrastructure integrations: optional object storage, email delivery, observability, and webhook integrations. Platform bootstrap credentials that cannot safely be self-provisioned remain deployment-level secrets and are clearly identified as one-time operator setup.

## UI and workflows

- A dedicated Settings > Integrations page lists providers by family and shows Not configured, Incomplete, Connected, Error, Disabled, or Needs attention.
- Add provider flow selects a provider and renders a typed, provider-specific form with required/optional fields, links to official documentation, and a short explanation of where to obtain credentials.
- Save validates the request, stores only encrypted secret material, and returns masked metadata (for example, last four characters only when appropriate; never returns the original key).
- Test connection runs a server-side, low-cost, bounded health check and returns sanitized success, permission, quota, endpoint, or network diagnostics. Error payloads must be redacted.
- Configure model routing: choose default models per capability (planning, extraction, review analysis, embeddings, report writing), fallback order, allowed regions, budget caps, timeout, and per-study override policy.
- Configure connector scope: enabled markets, locales, endpoints/entities, request budgets, rate limits, refresh schedule, and retention notes.
- Enable/disable is explicit and audited. Disabling a provider prevents new jobs from using it; in-flight jobs finish or fail according to documented cancellation policy.
- Rotate credentials by submitting a replacement; validate it before activation where provider semantics permit. Keep rollback metadata without retaining plaintext.
- Show last successful test, last used, latency, quota/usage if available, and recent sanitized failures.
- Provide a guided first-run checklist for required platform setup and the USB Cable study's minimum viable data sources.

## Security and storage contract

- Browser never receives stored secret values, encryption keys, service-role credentials, or provider responses containing credentials.
- Worker authenticates the Supabase JWT, verifies organization membership and Owner/Admin permission, validates provider schema, applies rate limits, and records an audit event.
- Persist non-secret settings separately from secret ciphertext. Secret records include organization/provider/credential name, ciphertext, nonce/IV, key version, created/updated timestamps, rotation state, and metadata; never plaintext.
- Encrypt with authenticated encryption (AES-256-GCM or a reviewed equivalent) using a high-entropy master key available only as a Worker secret. Keep key version metadata to support rotation. Do not store the master key in Postgres, browser bundles, Git, logs, or ordinary app settings.
- Use a dedicated server-side secret service abstraction so encryption/key management can migrate to Cloudflare Secrets Store or another KMS-backed service without changing provider adapters. Never claim that database encryption alone protects against a compromised Worker/master key.
- Restrict direct Data API access to credential tables; RLS and grants deny browser roles access. Only narrow Worker server operations can read/write ciphertext. Service-role access, if used, remains server-only and is not a general-purpose bypass for user authorization.
- Never log request bodies, authorization headers, API keys, decrypted values, or raw provider errors. Redact secrets from traces, exception messages, and audit payloads.
- Audit create/update/test/enable/disable/delete/rotate events with actor, organization, provider, timestamp, outcome, and changed field names; never include secret values.
- Support deletion and key rotation. Deleting a credential blocks future use and removes ciphertext according to retention policy; rotation re-encrypts active credentials with a new key version.
- Enforce per-org and global budgets, provider concurrency/rate limits, and a circuit breaker for repeated failures.

## Data model (logical)

- integration_providers: provider catalog, family, adapter key, supported capabilities, documentation URL, schema version.
- organization_integrations: organization, provider, display name, status, non-secret settings JSON, enabled markets, health metadata, created/updated by.
- integration_secrets: organization integration, secret name, ciphertext, nonce, key version, last rotated timestamp. Private schema/table; no browser grants.
- model_routes: organization, capability, primary provider/model, ordered fallbacks, budget and timeout policy.
- integration_audit_events: actor, organization, integration, action, outcome, changed fields, timestamp, correlation ID.
- integration_usage: provider, integration, operation, units/tokens/cost, timestamp, study/task reference.

These are logical entities; final SQL names and policies are established in reviewed migrations.

## Acceptance criteria

1. Owner/Admin can add and edit a supported AI provider and search/data connector entirely from the UI.
2. User can test credentials; the Worker performs the call and returns sanitized diagnostics.
3. After save or refresh, the UI shows configured status and masked metadata only; the original credential cannot be retrieved from any browser API.
4. Invalid credentials do not become active; failed replacement does not silently destroy a working credential.
5. A non-admin cannot read, create, test, rotate, or delete organization credentials.
6. Cross-tenant tests prove one organization cannot inspect or use another organization's integration.
7. Provider credentials are encrypted at rest, key versioned, redacted from logs, and audited.
8. Study creation can select only enabled providers compatible with its markets, entities, and policy constraints.
9. Missing configuration produces a clear setup action and blocks the dependent job rather than generating fake results.
10. All normal provider/model changes require no code commit or redeployment. Platform bootstrap secrets and account-level bindings are explicitly documented exceptions.

## Initial provider onboarding order

1. AI provider (at least one model supporting structured output).
2. Search provider for global research.
3. China-capable search/product-data provider selected after credentials, coverage, contract, and legal review.
4. One product/marketplace data source.
5. One permitted review source or structured user upload.
6. Optional enrichment and secondary model providers.

No provider is represented as connected until a real server-side test succeeds.
