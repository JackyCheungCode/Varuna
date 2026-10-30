# Varuna — Product Blueprint

## 1. Product definition

Varuna is a category-agnostic, evidence-led product intelligence and product-development decision platform for China and international markets. A user starts with a product category, existing product, concept, customer problem, competitor, or market-entry question. Varuna plans and conducts a lawful, source-aware investigation; normalizes and evaluates evidence; analyzes market demand, customers, competitors, technical feasibility, suppliers, costs, compliance, and commercial scenarios; and produces a traceable development decision.

Varuna is not an unrestricted web crawler, a raw API aggregator, or an AI report generator. It must never imply that all internet data is accessible. API availability does not imply commercial permission, complete coverage, or reliable data.

### Product principles

1. Decision-first: research questions and evidence requirements are driven by a concrete decision.
2. Global + China: multilingual and multi-market from the data model onward.
3. Category-agnostic: USB Cable is the first validation category, not a hard-coded product type.
4. Evidence traceability: every material claim links to sources, time, geography, method, and limitations.
5. Epistemic separation: observed, derived, estimated, inferred, and recommended statements remain distinguishable.
6. Triangulation: independence and upstream provenance matter more than raw source count.
7. Human accountability: consequential interpretations and go/no-go decisions require human review.
8. Secure configuration: credentials are stored server-side; browser clients never receive provider secrets.
9. Adaptive research: collect broadly where useful and lawful, then stop when marginal evidence value is low or access/cost limits are reached.
10. Honest uncertainty: disclose inaccessible sources, missing fields, conflicting evidence, and unsupported questions.

## 2. Primary user journeys

### 2.1 Create a research project

1. User creates a workspace and research project.
2. User enters a category/product/concept/problem/competitor/market question.
3. User selects target countries/regions, languages, channels, period, customer segments, budget, and decision deadline.
4. Varuna classifies the subject and builds a category ontology, synonyms, query expansions, and attribute dictionary.
5. The planner converts the business decision into research questions, evidence requirements, source candidates, sampling plans, and stopping rules.
6. User reviews the research plan, scope, budget, and restricted sources before collection begins.

### 2.2 Execute research

1. A job orchestrator creates work items by research question, geography, language, and source family.
2. Provider adapters collect permitted records with quotas, retries, rate limits, and idempotency.
3. Raw evidence and normalized entities are stored with source identifiers, URLs, timestamps, locale, rights status, and parser version.
4. Quality services score completeness, freshness, authority, sampling limitations, duplication, and source independence.
5. Entity resolution links products, variants, sellers, brands, suppliers, and companies while retaining match confidence.
6. AI extraction and classification produce structured attributes and themes; deterministic code handles arithmetic, conversions, validation, and scoring.
7. The study coverage dashboard shows completed, partial, inaccessible, not searched, no records, and conflicting evidence.

### 2.3 Analyze and decide

1. Market/customer analysis separates measured transactions from demand proxies and stated interest.
2. Competitor analysis benchmarks price, product attributes, positioning, channels, reviews, and substitutes.
3. Technical analysis maps requirements to standards, tests, certifications, and product risks.
4. Supplier analysis compares manufacturers, traders, quotations, MOQ, lead time, quality evidence, and landed cost.
5. Opportunity hypotheses include evidence for and against, risks, economics, and validation experiments.
6. Varuna drafts a decision report and product development brief.
7. A human reviewer approves, rejects, or requests further evidence.
8. Optional monitoring tracks meaningful changes and records the source and magnitude of each alert.

## 3. Research domains and source/API taxonomy

The Configuration Center organizes providers under the following domains. The taxonomy is stable even when individual providers change.

| Domain | Research purpose | Candidate sources / APIs | Important limitations |
|---|---|---|---|
| D01 Marketplace & retail | Listings, catalog, variants, prices, seller and category observations | Amazon SP-API / Creators API, eBay Browse, Walmart APIs, Alibaba.com, 1688, Taobao/Tmall, JD, Pinduoduo, AliExpress | Seller/app eligibility, regional coverage, quotas, terms, commercial reuse and review access differ |
| D02 Search & discovery | Search results, keyword demand indicators, query intent and visibility | Google Ads Keyword Planning, Google Trends where authorized, DataForSEO, Bing, Baidu Marketing | Keyword metrics and rankings are not sales; API products expose different fields |
| D03 Social & communities | Public discussion, creator content, engagement and topic discovery | Reddit API, YouTube Data API, X API, Bilibili, Zhihu, Xiaohongshu, Douyin, TikTok Research API where eligible | Platform restrictions, research-only programs, public/private distinctions and retention rules |
| D04 Reviews & feedback | Ratings, complaints, product experience, return reasons and support themes | Authorized marketplace review feeds, user uploads, CRM/support/returns, surveys and interviews | Sampling bias, incentives, manipulation, missing denominators and platform restrictions |
| D05 Trends & demand | Seasonality, category interest, traffic and demand proxies | Google Trends, Google Ads, DataForSEO, Baidu, Similarweb, Semrush, Ahrefs | Definitions and coverage vary; proxies must not be reported as measured sales |
| D06 Supplier & manufacturing | Manufacturer discovery, quotations, MOQ, lead times, materials and capabilities | 1688, Alibaba.com, licensed supplier directories, RFQs, user-uploaded quotations | Listing claims are not factory verification; quotations need comparable terms and dates |
| D07 Company & competition | Brands, company profiles, portfolios, channels, announcements and competitive moves | Company websites, registries, licensed company databases, marketplace catalogs, public filings | Entity identity and source independence require verification |
| D08 Technical & standards | Product specifications, standards, certifications, patents and test evidence | USB-IF, standards bodies, certification databases, patent offices, laboratories, product datasheets | Standards text and certification data have licensing/access conditions; marketing claims are not test results |
| D09 Pricing & commercial | Price history, promotions, channel margins and unit economics | Marketplace/retailer feeds, licensed price intelligence, supplier quotations, user cost data | Currency, VAT/tax, shipping, discounts and observation time must be normalized |
| D10 Trade, logistics & market access | Import/export, tariffs, logistics, country requirements and trade flows | Customs/trade statistics, tariff databases, logistics providers, government portals | HS-code mapping, time lags, aggregation and country definitions can distort estimates |
| D11 AI & analytical providers | Classification, extraction, translation, reasoning, embeddings and verification | OpenAI, Anthropic, Gemini, DeepSeek, Qwen, Workers AI and future compatible providers | Provider capability, privacy, region, pricing, model availability and retention must be configured |
| D12 First-party evidence | Actual customer, sales, returns, support, tests and internal product data | User-authorized CSV/XLSX/PDF uploads and future system connectors | Tenant isolation, consent, PII minimization and retention controls are mandatory |

Every provider needs a dossier: legal/access basis, eligibility, supported regions/languages, fields, freshness, quota, cost, commercial rights, retention/display limits, security, reliability, and decision relevance. A connector must not be marked production-ready merely because an API key is present.

### Provider lifecycle states

- Not configured
- Credentials missing
- Configured, not tested
- Connected / test passed
- Restricted / approval required
- Degraded / quota or provider issue
- Disabled by policy
- Retired

Provider status must be separate from data coverage and study status.

## 4. Evidence and data quality model

### 4.1 Claim types

- Observed: directly present in a source or measurement.
- Derived: computed from observed inputs using a disclosed deterministic method.
- Estimated: quantified using assumptions and an uncertainty range.
- Inferred: interpretation supported by evidence but not directly measured.
- Recommended: proposed action based on objectives, evidence, and trade-offs.

Every material claim must include supporting and contradicting evidence, source independence, geography, time period, method, limitations, confidence rationale, and review status.

### 4.2 Evidence quality dimensions

Evaluate authority, proximity to underlying event, accuracy, completeness, freshness, reproducibility, sampling frame, selection bias, survivorship bias, language/geography bias, bot/manipulation risk, denominator, metric definition, upstream duplication, conflict of interest, and rights/retention constraints.

Do not count syndicated copies of the same upstream dataset as independent corroboration. Do not treat large samples as representative by default. Preserve conflicting observations rather than overwriting them.

### 4.3 Market sizing and quantitative rigor

Use suitable combinations of:
- Top-down market totals with transparent segment boundaries.
- Bottom-up units, customers, channel coverage, frequency, replacement cycle, and verified transaction data.
- Supply-side checks using capacity, shipment, import/export, company disclosures, and channel evidence.
- Primary research to validate customer behavior and assumptions.

Every estimate must disclose market definition, geography, period, currency, value/units, formula, inputs, assumptions, addressable-market boundary, uncertainty range, sensitivity, double-counting risk, and cross-check.

Search volume, ranking, views, likes, listing count, review count, and traffic estimates are not sales. They may be labeled as proxies only.

### 4.4 Coverage and stopping

Track coverage by research question, workstream, geography, language, source family/provider, entity/segment, fields, period, access outcome, usable records, quality, and cost. Distinguish covered, partial, not covered, inaccessible/restricted, no relevant records, awaiting primary research, and conflicting evidence. Never show an unexplained completeness percentage.

Stop when sources are exhausted, marginal evidence value is low, budget is exceeded, rights are unclear, or further collection is unlikely to change the decision. Ask for human approval where additional spend or scope is material.

## 5. AI system design

Use a provider-neutral model router with per-task capability selection, fallback, budget ceilings, timeout/retry policy, telemetry, prompt/model/schema versioning, and evaluation.

Specialized AI tasks:
- Product/category classification and query expansion.
- Research plan proposal and source selection.
- Product, variant, seller, brand, and supplier entity resolution assistance.
- Attribute extraction and unit normalization.
- Chinese/English/multilingual translation and semantic clustering.
- Review topic, sentiment, complaint and pain-point classification.
- Competitor comparison and opportunity hypothesis generation.
- Analysis assistance, report drafting, contradiction detection, and claim verification.

Deterministic code must handle authorization, arithmetic, currency/unit conversion, schema validation, deduplication keys, reproducible scores, and data retention. AI output is untrusted until schema-validated and linked to evidence. Isolate source text from system instructions to reduce prompt-injection risk. Minimize PII and maintain Chinese/English evaluation sets. Never display an AI confidence percentage without calibration and rationale.

### AI configuration

Allow authorized administrators to configure provider, API base URL where supported, secret key, model ID, task capability, context/output limits, timeout, retry, budget, enabled state, and fallback order. Secret values are written only to server-side encrypted secret storage and are never returned to the browser. The UI may show masked presence, last test status, and rotation controls.

## 6. Product opportunity and decision framework

Each opportunity should describe target customer/use case, unmet need, product concept, differentiating attributes, geography/channel/price tier, evidence for and against, alternatives, technical/sourcing/compliance risks, unit economics, upside scenarios, uncertainty, and validation experiments.

A transparent prioritization framework may combine customer impact, evidence quality, strategic fit, differentiation, feasibility, margin potential, and validation cost. Mandatory safety, legal, certification, and technical gates are hard constraints: a high weighted score cannot compensate for a failed gate. Include develop, defer, investigate, and do-not-develop outcomes.

## 7. Research report and development brief

1. Executive decision: develop / defer / no-go / further validation.
2. Scope, definitions, methods, dates, and coverage limitations.
3. Market structure and geographic segmentation.
4. Demand and trend evidence, with proxy labels.
5. Customer segments, jobs, purchase criteria, and pain points.
6. Competitors, substitutes, positioning, channels, and benchmark.
7. Product attributes and technical benchmark.
8. Opportunity hypotheses with evidence for/against.
9. Supplier/manufacturing and compliance feasibility.
10. Pricing, landed cost, unit economics, and low/base/high scenarios.
11. Risks, contradictions, missing evidence, and unresolved questions.
12. Product development brief and validation plan.
13. Claim-to-evidence appendix and source register.

The development brief includes target segment, product concept, mandatory/differentiating/optional features, target specifications, verification tests, standards/certifications, target cost and price, supplier requirements, packaging/warranty/service, go/no-go criteria, risks, and next experiments.

## 8. USB Cable first-category validation

USB Cable is the first end-to-end validation category. The ontology must not collapse connector shape, USB protocol, data rate, charging power, cable length, e-marker, materials, construction, safety, and certification into one generic attribute.

The first study must:
1. Define subcategories, synonyms, query expansions, and a structured attribute dictionary.
2. Create China and international research plans.
3. Record which sources were actually queried and which were unavailable.
4. Ingest at least one authorized external dataset or clearly labeled sample.
5. Preserve source IDs, URLs, timestamps, raw and normalized values, rights classifications, and parser versions.
6. Compare competitor price and positioning with geography, currency, channel, and observation time.
7. Extract customer pain-point themes with sample size, sampling caveats, language coverage, and evidence examples.
8. Distinguish demand proxies from sales; avoid unsupported market-size claims.
9. Produce opportunity hypotheses with evidence for and against.
10. Produce a product brief, supplier questions, cost assumptions, risk register, and validation plan.
11. Support human approval, rejection, and requests for more evidence.

A fabricated, uncited, or untraceable conclusion fails acceptance even if the report looks polished.

## 9. Application information architecture

### Main navigation

- Overview: portfolio, active studies, recent activity, system health, provider readiness.
- Research Projects: create, plan, execute, monitor, compare and archive studies.
- Market Intelligence: market structure, demand, customer signals, channel and country views.
- Product Intelligence: product ontology, attributes, competitor benchmark, variants and technical comparisons.
- Customer Voice: reviews, complaints, themes, segments and evidence samples.
- Competitors: brand/company/product profiles, positioning and changes.
- Suppliers: manufacturer/trader profiles, RFQs, quotations, MOQ, lead times and quality checks.
- Opportunities: hypotheses, prioritization, validation experiments and decision history.
- Reports: decision reports, development briefs, exports and evidence appendix.
- Configuration Center: API providers, AI providers/models, routing, budgets, access tests, status, audit and retention.
- Administration: workspace, members, roles, permissions, billing/usage, audit and system settings.

### Professional UI requirements

Use a restrained enterprise research-console visual system: clear hierarchy, consistent spacing, readable typography, neutral surfaces, deliberate accent color, dense but legible data tables, accessible contrast, responsive layouts, clear empty/loading/error states, and desktop/mobile adaptations. Prioritize research workflows and data readability over decorative dashboards. Every metric must show units, time range, geography, source, and whether it is observed or a proxy. Avoid fabricated KPI values in production.

## 10. Target architecture

### Frontend
- React + TypeScript + Vite.
- Cloudflare Pages.
- Authenticated workspace shell and responsive research console.
- Typed API client; no provider secrets in browser bundles or local storage.

### API and orchestration
- Cloudflare Workers as the application API and provider execution boundary.
- Cloudflare Queues for retryable asynchronous collection and enrichment.
- Cloudflare Workflows for durable multi-step research orchestration where appropriate.
- R2 for raw evidence artifacts and report files after account enablement.
- Workers AI / AI Gateway only where enabled and suitable; external model providers through server-side adapters.

### System of record
- Supabase Postgres for users/workspaces, research projects, plans, tasks, provider metadata, normalized entities, evidence metadata, claims, analyses, reports, decisions, audit events, and usage.
- Supabase Auth for identity and sessions.
- pgvector when enabled for semantic retrieval; relational evidence references remain authoritative.

### Trust boundaries
- Browser: user interface, publishable Supabase key only where needed, no provider credentials.
- Worker: authentication verification, authorization, provider secrets, API adapters, job dispatch, AI routing, validation, rate limiting and audit.
- Supabase: tenant-scoped relational system of record with RLS.
- R2: rights-aware raw artifacts and exports with scoped access.
- External providers: least-privilege credentials, provider-specific quotas and retention obligations.

## 11. Core domain entities

- workspaces, workspace_members, roles, invitations
- research_projects, research_scopes, research_questions, research_plans
- research_runs, research_tasks, task_attempts, coverage_items
- provider_catalog, provider_connections, provider_capabilities, provider_test_runs
- ai_providers, ai_models, ai_task_routes, ai_usage_events
- source_records, evidence_artifacts, evidence_observations, source_rights
- products, product_variants, product_attributes, brands, companies, sellers, suppliers
- reviews, review_themes, price_observations, search_observations, trend_observations
- supplier_quotes, technical_standards, certifications, test_results
- claims, claim_evidence_links, analyses, opportunities, opportunity_scores
- reports, report_versions, development_briefs, decisions, approvals
- audit_events, budgets, usage_ledger, monitoring_rules, alerts

All tenant-owned rows require explicit workspace ownership and RLS. Cross-tenant access must be denied by default. Provider credentials should not be stored as plaintext in ordinary application tables; use Cloudflare secrets or an appropriately encrypted server-side secret vault with access audit and rotation. Never expose service-role keys to clients.

## 12. API and AI integration strategy

Build provider-neutral adapters with a common contract: capability discovery, connection test, health/status, quota metadata, fetch/collect, normalize, error classification, retryability, provenance, and rights metadata. Keep provider-specific request/response mapping isolated.

Integration phases:
1. Core infrastructure and mock/test adapters.
2. First lawful search and marketplace connectors selected by actual access and user eligibility.
3. China marketplace and search connectors as credentials and approvals permit.
4. Social/community and reviews only within platform terms and authorized access.
5. Supplier, trade, standards, and licensed datasets.
6. Additional AI providers and model routing.
7. First-party imports and optional enterprise integrations.

Never mark a connector as available merely because it appears in the catalog. UI status must distinguish adapter implemented, credentials configured, connection test passed, production access approved, and data actually collected.

## 13. Security, governance, and operations

- Enforce tenant isolation with RLS and server-side authorization.
- Keep provider credentials server-side; encrypt at rest, redact logs, and support rotation/deletion.
- Use least privilege, short-lived tokens where available, and explicit provider scopes.
- Apply rate limits, quotas, budget ceilings, idempotency keys, retry backoff, and dead-letter handling.
- Validate and sanitize all provider and model outputs.
- Treat retrieved content as untrusted; protect against prompt injection and malicious files.
- Record audit trails for configuration, access, collection, approval, export, and deletion.
- Respect data licenses, platform terms, privacy, retention, deletion, and display restrictions.
- Add observability for request latency, task success, provider errors, queue age, model cost, token usage, and study coverage.
- Separate local, preview/staging, and production environments.
- Run database security/performance advisors after schema changes.

## 14. Delivery roadmap and gates

### Phase 0 — Foundation
Repository structure, product blueprint, architecture contracts, environment inventory, CI, typed configuration, secrets policy, database migration baseline.

Exit gate: reproducible build, clean environment separation, no leaked secrets, documented schema and API contracts.

### Phase 1 — Usable platform shell
Authentication, workspace, project CRUD, navigation, dashboard, project creation wizard, configuration center, audit and responsive professional UI.

Exit gate: user can sign in, create and edit a research project, configure providers safely, and see accurate connection status.

### Phase 2 — Research orchestration
Research plan, task queue, worker API, provider adapter contract, run lifecycle, retry/idempotency, coverage tracking, evidence ledger.

Exit gate: a sample research run executes end-to-end with traceable source records and honest partial coverage.

### Phase 3 — First external connectors and AI
Enable selected providers based on credentials, access rights and test results; implement model routing and structured extraction.

Exit gate: at least one authorized live source and one configured AI model can run a validated workflow; unavailable providers are visibly marked.

### Phase 4 — Analysis and reports
Entity resolution, product attribute normalization, market/customer/competitor analysis, evidence-linked claims, report generation and human approvals.

Exit gate: USB Cable pilot report passes evidence traceability and quantitative rigor checks.

### Phase 5 — Supplier, economics, monitoring and scale
RFQs, quote comparisons, landed-cost scenarios, monitoring, alerts, usage controls, performance hardening and multi-tenant acceptance.

Exit gate: production operational readiness, backup/restore, security review, monitoring, cost controls and user acceptance.

## 15. Production acceptance criteria

- A user can authenticate and create a workspace and project.
- Project creation captures research scope and decision intent.
- Research plans map questions to evidence and sources.
- Providers expose accurate lifecycle states and never fake connectivity.
- Credentials are stored and used only server-side.
- Every collected observation retains provenance and rights metadata.
- Claims link to supporting and contradicting evidence.
- Proxy metrics are never labeled sales.
- Market sizing shows method, assumptions, ranges and limitations.
- AI outputs are schema-validated and auditable.
- Human review controls consequential recommendations.
- RLS prevents cross-tenant data access.
- Async tasks are idempotent, retryable and observable.
- UI is responsive, accessible, professional, and honest about empty/error/partial states.
- Deployment is repeatable with preview/staging separated from production.
- Backups, monitoring, incident and credential-rotation procedures are documented.

## 16. Non-goals and explicit limitations

Varuna does not promise universal access to all websites or platforms, bypass of paywalls/login/CAPTCHA/technical controls, unrestricted scraping, exact sales data where no authorized transaction source exists, guaranteed market forecasts, or autonomous high-impact business decisions. Paid/licensed APIs, platform approval, account eligibility, regional availability, and commercial terms remain user/provider dependent.

## 17. Immediate implementation priorities

1. Preserve the existing product-foundation branch and PR.
2. Establish a real application repository structure and CI/build validation.
3. Resolve the Cloudflare resource discrepancy before deployment; do not overwrite an existing Worker.
4. Design and migrate tenant-safe Supabase schema with RLS and audit.
5. Implement Worker API contracts, auth, secret management and provider registry.
6. Build professional responsive frontend shell and Configuration Center.
7. Add project creation, research plan, run lifecycle and evidence ledger.
8. Add first authorized search/marketplace and AI adapters.
9. Test the USB Cable end-to-end pilot.
10. Deploy preview first; production only after health, security, and acceptance checks.
