# Varuna Product Research Methodology and Decision Framework

Status: Planning baseline | Version: 0.1 | Date: 2026-10-30

## 1. Mission and research contract

Varuna accepts a product, product category, product concept, or product problem as input and produces an evidence-backed assessment of China and international markets, competitive conditions, customer needs, product requirements, sourcing feasibility, commercial risks, and recommended next decisions.

Varuna is not merely an API aggregator or an AI report writer. Its primary output is a defensible decision: whether to develop, what to develop, for whom, where, at what target specification and cost, and what evidence is still missing.

The objective is to discover as much relevant, lawfully accessible evidence as practical across the open web, official APIs, licensed datasets, public records, marketplace sources, social/community sources, technical references, and user-authorized data. "All internet data" is not a technically or legally achievable guarantee. Some data is private, unindexed, paywalled, unavailable by API, restricted by contract, geographically limited, or unreliable. Varuna must disclose these coverage boundaries rather than imply completeness.

## 2. Decision-first research design

Every study starts with the decision it must support, not with a fixed list of APIs.

### 2.1 Input types

- Existing product/category: e.g. USB Cable.
- Product concept: e.g. a compact high-power USB-C cable for travel.
- Customer problem/use case: e.g. cable overheating or frequent connector failure.
- Competitor/product reference: a named product, brand, URL, image, or SKU.
- Market-entry question: e.g. whether to launch a particular product in China, US, or EU.

The system should extract the initial scope, identify ambiguity, and ask only for information that materially changes the study. If the input is broad, begin with exploratory discovery and propose a scope for human approval rather than silently narrowing it.

### 2.2 Research objective

Each study records:
- Decision to be made.
- Product/category definition and inclusion/exclusion rules.
- Target geographies, channels, customer segments, and languages.
- Historical observation window and forecast horizon.
- Product maturity and intended business model.
- Required confidence and acceptable uncertainty.
- Budget, time, and source-access constraints.
- Explicit hypotheses and questions to test.

A study may start broad, then branch into sub-studies for specific countries, segments, channels, or product concepts.

## 3. End-to-end research pipeline

### Stage 1 — Product and market definition

1. Resolve the product's common names, synonyms, local-language terms, taxonomy, adjacent categories, use cases, and substitute products.
2. Define what counts as an in-scope product and what must be excluded.
3. Create a product ontology and initial attribute dictionary.
4. Identify relevant standards, units, technical claims, and market-specific terminology.
5. Generate Chinese and international search/query expansions, including transliterations and buyer-intent variants.
6. Record unresolved classification ambiguity.

For USB Cable, the system must not collapse connector shape, charging power, data protocol, data rate, length, e-marker, material, and certification into one generic "USB-C cable" attribute.

### Stage 2 — Adaptive research planning

An AI research planner proposes a source and method plan for each research question. The plan is adaptive: source selection depends on the evidence needed, target geography, available access, source quality, cost, and the expected value of additional information.

The plan maps each question to:
- Required evidence and entity types.
- Candidate primary, corroborating, and fallback sources.
- Collection method and permitted access model.
- Geography, language, time range, and sampling design.
- Expected fields, limitations, and cost.
- Quality checks and stopping conditions.

The planner must not select a source merely because an API exists. An official API, licensed provider, government dataset, primary interview, user upload, and manual expert observation can each be appropriate for different questions.

### Stage 3 — Broad, compliant evidence acquisition

Acquire relevant evidence from multiple source families:
- Search engines, SERPs, keyword and trend tools.
- E-commerce marketplaces, retailer catalogs, price observations, and product listings.
- Social platforms, forums, creator content, and public communities.
- Reviews, ratings, customer feedback, complaints, support and return records.
- Government, trade, customs, industry association, academic, standards, patent, and company sources.
- Supplier/manufacturer directories, RFQs, quotations, and product documentation.
- Licensed market/consumer/traffic databases.
- User-authorized internal data, interviews, surveys, experiments, and product tests.

Collection must obey provider terms, applicable law, privacy requirements, rate limits, access controls, licensing, and retention obligations. Do not bypass login controls, paywalls, CAPTCHAs, technical restrictions, or API quotas.

For each source, record coverage and collection outcome. Distinguish "no evidence found" from "source not accessible", "field not exposed", "not searched", and "zero observed records".

### Stage 4 — Evidence preservation and normalization

Maintain a source evidence ledger. Every collected record should preserve, where available:
- Provider/source, API product, endpoint or collection method.
- External record ID and original URL/reference.
- Raw payload or lawful retained excerpt, checksum, and storage reference.
- Collected time, source publication/update time, and observation period.
- Market, locale, language, currency, unit, and timezone.
- Rights/retention classification and display restrictions.
- Parser, mapping, normalization, and model versions.
- Quality flags, missing fields, deduplication and entity-resolution decisions.

Normalize data into canonical entities without destroying raw values. Preserve conflicting observations instead of overwriting them. Product identity matching must expose match confidence and the basis for linking variants/listings across providers.

### Stage 5 — Evidence quality and bias assessment

Assess every important dataset and claim for:
- Source authority and proximity to the underlying event.
- Accuracy, completeness, freshness, and reproducibility.
- Sampling frame, selection bias, survivorship bias, and geographic/language bias.
- Duplicate records, bot/manipulated engagement, review incentives, and platform ranking effects.
- Metric definition, denominator, unit, period, and missingness.
- Independence from other sources (two vendors may resell the same upstream dataset).
- Conflicts of interest and commercial incentives.
- Legal permission and retention limits.

Do not treat a large sample as representative by default. Do not count syndicated copies of the same source as independent corroboration.

### Stage 6 — Market and customer analysis

Analyze distinct questions separately:

**Market structure**
- Category definition and boundaries.
- Market segments, use cases, channels, geographies, and price tiers.
- Value chain, channel economics, and regulatory context.
- Market size only where defensible data and explicit assumptions exist.

**Demand**
- Search behavior, category interest, purchase signals, observed transactions where available, repeat/replacement cycles, and seasonality.
- Distinguish stated interest, observed behavior, platform proxy metrics, and measured sales.
- Identify demand by segment, country, channel, and time period.

**Customer**
- Buyer/user distinction, jobs-to-be-done, purchase triggers, constraints, willingness to pay, switching behavior, and unmet needs.
- Segment by meaningful behavior and use case, not unsupported demographic stereotypes.
- Use reviews and public discussions to generate hypotheses, then validate important hypotheses with primary research.

**Competition**
- Direct competitors, indirect alternatives, substitutes, private labels, and new entrants.
- Product portfolio, specification, price, positioning, channel, distribution, reviews, strengths, weaknesses, and evidence of differentiation.
- Competitor claims must be separated from independently verified capabilities.

### Stage 7 — Product and technical opportunity analysis

Convert customer and market evidence into candidate product requirements:
- Feature and attribute importance by segment/use case.
- Functional and performance requirements.
- Reliability, durability, safety, compliance, usability, packaging, and service expectations.
- Technical feasibility, standards, certifications, and test requirements.
- Feature trade-offs, target cost, target retail price, and manufacturability.
- Differentiation hypotheses and defensibility.

For each proposed requirement, show supporting evidence, affected segment, importance, confidence, trade-offs, verification method, and whether it is mandatory or optional.

Use a transparent prioritization method (for example, impact × evidence confidence × strategic fit, with risk/effort penalties). Do not let an opaque AI score become the decision itself.

### Stage 8 — Supplier, cost, and commercial feasibility

Where relevant, analyze:
- Manufacturer versus trader/distributor evidence.
- MOQ, quotation tiers, sample cost, lead time, capacity, customization, and payment terms.
- Materials, components, process, quality controls, testing, and certifications.
- Currency, Incoterms, freight, duties, taxes, packaging, returns, warranty, channel fees, and marketing assumptions.
- Unit economics under low/base/high scenarios.
- Sensitivity to price, volume, defect rate, freight, exchange rates, and channel margin.

Separate supplier asking prices from verified quotations and landed-cost estimates. Identify assumptions and obtain multiple comparable quotations before treating a cost as validated.

### Stage 9 — Opportunity hypotheses and decision options

Generate a small set of explicit opportunity hypotheses. Each must state:
- Target customer and use case.
- Unmet need or market gap.
- Proposed product concept and differentiating attributes.
- Relevant geography/channel/price tier.
- Evidence for and against.
- Competing alternatives and why they may remain preferable.
- Technical, sourcing, compliance, and commercial risks.
- Required validation experiments.
- Expected upside and uncertainty.

Include a "do not develop / defer / investigate further" option. The system must be able to recommend no-go when evidence is weak or economics are unattractive.

### Stage 10 — Validation and product development brief

Recommend the next best validation activities, such as:
- Customer interviews and structured surveys.
- Landing-page or price tests.
- Prototype and usability tests.
- Laboratory/performance testing.
- Supplier RFQs and sample comparisons.
- Channel/retailer interviews.
- Small controlled pilots.

The final product development brief should include:
- Product concept and target segments.
- Market/region priority.
- Product requirements and attribute targets.
- Must-have / differentiating / optional features.
- Technical standards and verification plan.
- Target cost, target price, and unit economics scenarios.
- Competitor benchmark.
- Supplier/manufacturing requirements.
- Packaging, warranty, and service expectations.
- Go/no-go criteria, risks, open questions, and next experiments.

### Stage 11 — Human decision and monitoring

AI prepares analysis and recommendations; authorized humans approve scope, important interpretations, product requirements, supplier commitments, and go/no-go decisions.

After approval, Varuna can monitor relevant sources for price changes, new competitors, review themes, standards changes, supplier changes, and demand signals. Monitoring alerts must state what changed, source, time, magnitude, and reliability.

## 4. Quantitative rigor and market sizing

Market sizing must be a dedicated analytical workstream, not a number generated from search volume.

Use more than one suitable method where data permits:
- Top-down: start with a credible market/industry total, then define relevant segments and adjust transparently.
- Bottom-up: estimate from observable units, customers, channel coverage, purchase frequency, replacement cycle, or verified company/retailer data.
- Supply-side cross-check: manufacturer capacity, shipments, imports/exports, company disclosures, and channel inventory where relevant.
- Primary research: surveys/interviews/experiments to test assumptions and segment behavior.

For every estimate, disclose:
- Market definition, geography, period, currency, and whether value or units.
- Formula, inputs, sources, and assumptions.
- Addressable versus total market boundaries.
- Range and sensitivity, not false precision.
- Double-counting and coverage risks.
- Independent cross-check and unresolved discrepancy.

Search volume, ad impressions, ranking, views, likes, listings, review counts, and traffic estimates are not sales. They may be explanatory indicators or proxies only when their definitions and limitations are explicit.

Forecasting should use scenarios (low/base/high), explicit drivers, and uncertainty ranges. Historical correlation alone does not establish causation or guarantee future growth.

## 5. Evidence and claim model

Every material report statement must be typed as one of:
- **Observed:** directly present in a source or measurement.
- **Derived:** computed from observed inputs using a disclosed method.
- **Estimated:** quantified with assumptions and uncertainty.
- **Inferred:** an interpretation supported by evidence but not directly measured.
- **Recommended:** a proposed action based on evidence, objectives, and trade-offs.

Each claim should carry:
- Claim text and claim type.
- Supporting and contradicting evidence references.
- Source independence and quality.
- Geography, segment, and time scope.
- Method and calculation where applicable.
- Confidence level with explanation.
- Limitations and missing evidence.
- Reviewer and approval status.

Confidence must not be a decorative AI-generated percentage. Use calibrated quality dimensions and explain why a claim is high, medium, or low confidence. If evidence is insufficient or conflicting, say so.

## 6. Triangulation and contradiction handling

For high-impact claims, seek corroboration from genuinely independent evidence types, for example:
- Marketplace listing/price observations + retailer or transaction evidence.
- Search trends + category/company disclosures + primary customer research.
- Review themes + interviews + return/defect data.
- Supplier quotations + samples + laboratory tests.
- Trade statistics + company reports + channel checks.

Triangulation does not mean averaging incompatible metrics. First reconcile definitions, period, geography, product scope, units, and sampling. Preserve disagreements and explain which source is more suitable for the specific question.

AI should identify contradictions, missingness, duplicate upstream data, and possible source bias. It must not resolve factual conflict by simply choosing the most common statement.

## 7. Study coverage, stopping rules, and research efficiency

"Use as much of the internet as possible" must be operationalized as coverage of relevant evidence, not unlimited crawling.

Track coverage by:
- Research question and workstream.
- Geography and language.
- Source family and source/provider.
- Product/competitor/segment.
- Required fields and time period.
- Access success, usable record count, quality, and cost.

Use diminishing-return stopping rules. Continue collecting when the expected value of additional evidence is high; stop or request approval when sources are exhausted, costs exceed budget, rights are unclear, or new collection is unlikely to change the decision.

A study coverage dashboard should distinguish:
- Covered with adequate evidence.
- Partially covered.
- Not covered.
- Inaccessible/restricted.
- No relevant records found.
- Awaiting primary research.
- Conflicting evidence requiring review.

Do not display a single "research completeness" percentage without showing its denominator and weighting method.

## 8. AI system responsibilities and safeguards

Use specialized, provider-neutral AI capabilities for:
- Product/category classification and query expansion.
- Research planning and source selection.
- Entity resolution and product/variant matching.
- Attribute extraction and unit normalization.
- Multilingual translation and semantic clustering.
- Review/topic/pain-point classification.
- Competitor comparison and opportunity hypothesis generation.
- Statistical analysis assistance and report drafting.
- Independent verification and contradiction detection.

Use deterministic code for arithmetic, currency/unit conversions, schema validation, deduplication keys, access control, and reproducible scoring where feasible.

AI controls:
- Structured outputs and schema validation.
- Source citations/evidence spans for factual claims.
- Prompt/model/schema versioning and cost telemetry.
- Abstention when evidence is missing.
- Untrusted-source prompt-injection isolation.
- PII minimization.
- Independent evaluation sets for Chinese and English.
- Human approval for consequential recommendations.

## 9. Research report structure

1. Executive decision summary: develop / defer / no-go / further validation.
2. Scope, definitions, methods, dates, and coverage limitations.
3. Market structure and geographic segmentation.
4. Demand and trend evidence.
5. Customer segments, jobs, purchase criteria, and pain points.
6. Competitor and substitute landscape.
7. Product attribute and technical benchmark.
8. Opportunity hypotheses and differentiated concepts.
9. Supplier/manufacturing and compliance feasibility.
10. Pricing, unit economics, and scenarios.
11. Risks, contradictions, and evidence gaps.
12. Product development brief and validation plan.
13. Claim-to-evidence appendix and source register.

## 10. Acceptance criteria for the first USB Cable study

The first study is successful only if Varuna can:
1. Define USB Cable scope, subcategories, synonyms, and technical attribute ontology without assuming all cables are equivalent.
2. Produce Chinese and international research plans and show which sources were actually queried.
3. Ingest at least one authorized external dataset or a clearly labeled structured sample, plus user-authorized review/supplier data where available.
4. Preserve source IDs, URLs, timestamps, raw values, normalized values, and access/retention classifications.
5. Identify product variants and compare technical attributes without conflating connector type, protocol, data rate, charging power, or certification.
6. Analyze competitor pricing and product positioning with market/currency/time context.
7. Extract customer pain-point themes with sample sizes, sampling caveats, language coverage, and evidence examples.
8. Separate demand proxies from observed sales and avoid unsupported market-size claims.
9. Produce opportunity hypotheses with evidence for and against, confidence rationale, and validation experiments.
10. Produce a development brief with target specifications, supplier questions, cost assumptions, risk register, and explicit go/no-go criteria.
11. Clearly show inaccessible APIs, missing fields, unavailable geographies, and unvalidated claims.
12. Allow a human reviewer to approve, reject, or request more evidence for material findings.

A fabricated, uncited, or untraceable market conclusion is a failed acceptance test even if the report looks polished.
