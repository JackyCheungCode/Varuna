# Varuna Product Requirements Document

Status: Approved baseline | Version: 0.1 | Date: 2026-10-30

## Vision
Varuna is an evidence-led product intelligence workspace. A user starts with a product, category, customer problem, or market question. Varuna plans research, gathers permitted data from configured sources, normalizes products and reviews, analyzes demand and competition, identifies opportunities, and produces an auditable product-development brief and market plan.

Markets are China and worldwide. Scope is category-agnostic. USB Cable is the first validation category, not a hard-coded schema. Research mode is AI-assisted automation with human approval for consequential conclusions. The target is a professional production platform.

## Goals
1. Research products and markets across China and international regions.
2. Connect search, marketplace, trend, social/community, review, and licensed data providers through replaceable adapters.
3. Build a category-agnostic product taxonomy and configurable attribute dictionary.
4. Match duplicate products and variants across sources while retaining source-specific observations.
5. Analyze large review corpora in batches and multiple languages.
6. Quantify demand signals, attributes, review themes, sentiment, pain points, and unmet needs with sample and coverage caveats.
7. Turn findings into opportunity hypotheses, product concepts, specification proposals, pricing hypotheses, and market-entry plans.
8. Preserve evidence lineage, data quality, model/prompt versions, costs, and human approvals.
9. Support secure multi-user and multi-organization operation.

## Non-goals for the first release
- Exact market size or unit sales claims without a source that measures them.
- Unrestricted data collection or circumvention of platform access controls.
- Autonomous product launches, purchasing, advertising, or supplier commitments.
- Replacing a general-purpose BI platform.
- Guaranteed complete coverage of every marketplace or country.
- Treating AI-generated conclusions as verified facts without validation.

## Users
- Owner/Admin: organizations, members, provider credentials, budgets, retention, and access policies.
- Research Lead: creates studies, selects markets and sources, approves plans and conclusions.
- Analyst: reviews products, attributes, reviews, segments, evidence, and reports.
- Viewer: reads approved findings and exports.
- System Operator: monitors connectors, queues, workflows, errors, and spend.

## Core journeys
### Study creation
User enters a research question, target markets, date range, category, available sources, budget, and depth. Planner proposes tasks, assumptions, coverage, and estimated cost. User edits and approves the plan.

### Collection and normalization
Workers start rate-limited connector jobs. Adapters fetch only data permitted by provider contracts and platform rules. Raw payloads follow source retention policy; normalized entities and observations are stored separately. Every record carries provenance and timestamps.

### Product analysis
Identify brands, products, variants, and source listings; extract structured attributes into category-specific schemas; track confidence and conflicting values; expose ambiguous matches for human review.

### Review analysis
Deduplicate and language-detect reviews, then process bounded batches. Extract aspect, topic, sentiment, polarity, usage context, pain point, desired outcome, and evidence spans. Aggregations include denominators, time windows, source mix, language mix, and uncertainty.

### Opportunity discovery
Combine demand signals, review pain points, product attribute gaps, competition, price bands, and feasibility assumptions. Each hypothesis links supporting and contradicting evidence, confidence, and validation questions.

### Decision brief
Report includes executive summary, market scope, method, source coverage, competitive landscape, attribute distributions, consumer needs, opportunity hypotheses, proposed specification, pricing hypotheses, risks, and next validation steps. Users can approve, reject, annotate, and version the brief.

## Functional requirements
- FR-01 Research workspace: create, edit, archive, duplicate, and list projects. Each has scope, markets, languages, dates, budgets, status, owner, and versioned plan.
- FR-02 Planner: convert questions into structured plans with tasks, source requirements, expected evidence, dependencies, cost estimates, and approval gates. Distinguish available from unavailable data.
- FR-03 Connector registry: capabilities, regions, entities, auth type, rate limits, pricing metadata, terms/retention notes, health, and last sync. Credentials remain server-side.
- FR-04 Product intelligence: canonical products and variants separate from source listings and observations. Configurable categories and typed attributes (text, number/unit, boolean, enum, range, dimensions, protocol). Preserve raw and normalized values.
- FR-05 Market observations: source-specific price, rank, availability, shipping, rating, review count, and trend observations with currency, locale, timestamp, and measurement semantics. Never infer sales from rank or search interest.
- FR-06 Review intelligence: authorized reviews/imports; deduplication; language detection; batch analysis; aspect/topic/sentiment/pain-point/need records with evidence spans and confidence.
- FR-07 Opportunity analysis: evidence-backed hypotheses with target segment, unmet need, alternatives, differentiator, market/price assumptions, feasibility, risks, confidence, and validation plan.
- FR-08 Product development: editable concepts and specification drafts. Each attribute is labeled observed, inferred, or recommended and links to evidence or an assumption.
- FR-09 Reports: versioned reports with evidence references, sample sizes, collection windows, coverage limitations, and export support.
- FR-10 Governance: role-based access, organization isolation, audit events, connector health, retries, dead-letter handling, usage/cost accounting, retention, and deletion.
- FR-11 Localization: Chinese and English initially; locale-aware currency, units, dates, time zones, and translated taxonomies; extensible to more languages.

## Non-functional requirements
Security: server-side secrets, least privilege, RLS on exposed tables, tenant isolation, audit logging, validation, secure webhook verification.
Reliability: idempotent jobs, bounded retries/backoff, dead-letter queues, resumable workflows, explicit terminal states.
Scalability: batch processing, pagination, bulk inserts, measured indexing/partitioning, object storage for large raw payloads.
Observability: structured logs, correlation IDs, task metrics, provider latency/errors/usage, AI token/cost tracking.
Quality: provenance, confidence, deduplication, human review for uncertain entity matching and consequential recommendations.
Accessibility: responsive analytical workspace and mobile-friendly review/monitoring.
Portability: replaceable provider adapters and model routing.

## USB Cable validation attributes
Connector ends and protocols; power rating in W; data rate with protocol; length with unit; jacket/material, braid, flexibility, connector design; color, pack size, warranty, certifications; compatibility claims and intended use. Power, protocol generation, and data rate are separate fields. Marketing claims are not silently treated as verified technical specifications.

## Success metrics
Measure provenance completeness, product/variant match precision on labeled samples, attribute extraction precision/recall, review-topic quality by language/category, evidence coverage of opportunity claims, connector success/freshness/cost per usable record, research completion time, report acceptance, and cross-tenant security. Set numeric targets after a labeled baseline exists.

## First end-to-end acceptance
A user creates and approves a USB Cable study; runs at least one configured authorized connector or uploads a structured sample; normalizes products and reviews with provenance; analyzes a bounded review batch; inspects attribute and review-theme summaries with sample denominators; and generates a report whose claims link to evidence. Missing credentials or unsupported coverage produce actionable status, never fabricated data.
