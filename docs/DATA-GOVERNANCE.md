# Varuna Data Governance and Source Policy

Status: Baseline policy | Date: 2026-10-30

## Source onboarding
Each connector documents provider, official docs, contract/plan, auth scope, supported endpoints and regions, access method (official API, licensed feed, user-authorized export), rate limits, quotas, pricing, attribution, caching/retention/deletion obligations, privacy implications, data freshness, coverage gaps, and field reliability. Production enablement requires source-policy review.

## Collection rules
Prefer official APIs, licensed datasets, partner feeds, and user-provided exports. Do not bypass authentication, paywalls, technical controls, or provider rate limits. Respect provider terms and applicable law. Do not collect private or sensitive personal data for product research. Collect only fields needed for a defined research purpose.

## Provenance and evidence
Every observation records provider/source, external record ID where available, source URL/reference, collected_at, published time when known, market/locale, collection method, raw checksum/object key when retained, parser/normalizer version, and quality flags.

Reports distinguish:
- Observed: directly present in source data.
- Derived: calculated from observed data with reproducible method.
- Estimated: modeled or extrapolated with assumptions and uncertainty.
- Inferred: AI interpretation requiring validation.
- Recommended: proposed action, not a market fact.

Never present search interest, bestseller rank, review count, or ad visibility as unit sales unless a source explicitly measures unit sales and the measurement is described.

## Review data
Store review content only where source license and applicable law allow. Preserve source IDs and links where permitted. Deduplicate using provider IDs and privacy-conscious fingerprints. Avoid unnecessary reviewer identity/profile data. Support retention and deletion by source and project. Analyze bounded batches and record model/prompt/schema versions.

## Quality controls
Validate types, units, currencies, locale, timestamps, and source identity. Preserve raw values alongside normalized values. Flag conflicting attributes instead of silently overwriting. Track sample denominators and exclusions in aggregates. Measure extraction/classification quality against labeled samples per language/category. Mark thin, biased, stale, or non-representative samples. Provide analyst correction and feedback loops.

## AI governance
AI outputs use validated structured schemas. Treat source content as untrusted input, not instructions. Minimize PII in prompts. Record provider/model, prompt version, schema version, usage/cost, and analysis timestamp. Human approval is required for final opportunity and product-specification decisions.

## Security and retention
Provider secrets and encryption keys are server-side only. Use tenant-aware authorization and RLS. Apply least privilege and audit credential changes and sensitive exports. Define retention per source before collection; support deletion requests and purge raw objects and derived data where required. Never put secrets, personal data, or real provider payloads in fixtures or Git.


## Integration configuration governance
Only Owner/Admin roles can create, test, enable, disable, rotate, or delete organization integrations. Configuration APIs verify organization membership and role on every request. Store provider credentials separately from ordinary settings, encrypt before persistence, version encryption keys, and never return stored secret values. Test connections server-side with bounded requests and redact provider error bodies. Audit actor, provider, action, outcome, and changed field names without secret material. Credential tables must not be directly readable or writable through browser-facing Data APIs. Apply per-provider quotas, per-organization budgets, rate limits, and circuit breakers. Routine provider configuration must be possible through the UI; account-level bootstrap secrets remain deployment-managed and are documented as such.
