# Varuna API Intelligence Taxonomy and Research Framework

Status: Planning baseline | Version: 0.1 | Date: 2026-10-30

## 1. Purpose

Varuna researches products and markets by combining independent evidence classes. API discovery, evaluation, configuration, and connector delivery must therefore be organized by **intelligence domain**, not as an unstructured list of vendors.

This taxonomy is category-agnostic. USB Cable is the first validation study, but the same API registry and evidence model must support future product categories.

A domain is a business capability (what evidence Varuna needs); a provider is a source/vendor (where evidence comes from); a connector is the technical adapter (how authorized data is accessed). These must remain separate concepts.

## 2. Top-level API and intelligence domains

### D01 — E-commerce and marketplace intelligence

**Research questions:** What products and variants are listed? Which brands and sellers compete? What are observed price bands, product attributes, availability, ratings, and listing changes?

**Subdomains**
- B2C marketplaces: Amazon, eBay, Walmart, AliExpress, Taobao/Tmall, JD, Pinduoduo.
- B2B marketplaces and wholesale: 1688, Alibaba.com and approved supplier marketplaces.
- Social commerce: Douyin E-commerce and other commerce platforms where approved.
- Retailer/catalog feeds and merchant product feeds.

**Typical evidence:** product/listing identifiers, title, brand, category, variant, images, structured attributes, observed price/currency, seller, availability, rating/review count where exposed, timestamp, market.

**Important distinctions:** listing price is not transaction price; catalog coverage is not market share; bestseller rank is not unit sales; marketplace review access is not implied by catalog API access.

### D02 — Search and web discovery intelligence

**Research questions:** What do buyers search for? Which products, competitors, and sources are discoverable? How does search visibility vary by country, language, and time?

**Subdomains**
- Search engine results and web discovery: Google, Bing, Baidu, and licensed SERP providers.
- Keyword research: Google Ads Keyword Planning, Baidu Marketing API, DataForSEO and alternatives.
- Web content discovery: product pages, brand sites, technical articles, comparison pages.
- Search result monitoring and competitor visibility.

**Typical evidence:** query, locale, geography, result URL/domain, rank, snippet, SERP feature, keyword metrics, observation time, provider metric definition.

**Important distinctions:** Google Ads Keyword Planning is not a general organic Search API; search volume is an estimate/proxy, not sales; SERP coverage and historical depth vary by provider.

### D03 — Social media and community intelligence

**Research questions:** What are consumers discussing? Which use cases, complaints, preferences, and emerging topics appear in public conversations?

**Subdomains**
- Global social networks: Reddit, X, YouTube, TikTok.
- China social/content platforms: Xiaohongshu, Douyin, Bilibili, Zhihu.
- Forums, specialist communities, creator channels, and discussion boards.
- Social listening vendors and licensed datasets.

**Typical evidence:** post/video/thread metadata, text or permitted excerpts, engagement counters, timestamps, language, topic, source URL/ID, author fields only when necessary and permitted.

**Important distinctions:** Research APIs may have strict eligibility rules; public visibility does not automatically grant collection or commercial reuse rights; engagement is not representative demand; minimize personal data.

### D04 — Reviews, ratings, and customer feedback intelligence

**Research questions:** What do customers praise, dislike, misunderstand, or report as defective? Which issues recur by product variant and use case?

**Subdomains**
- Marketplace reviews and ratings.
- Retailer and brand-site reviews.
- Video comments and community feedback where permitted.
- Customer support tickets, returns, warranty claims, surveys, and user-provided exports.
- Licensed review aggregation providers.

**Typical evidence:** rating, review date, language, product/variant reference, review text or licensed excerpt, source ID, verified-purchase flag if lawfully exposed, aspect/topic, sentiment, defect/pain-point label.

**Important distinctions:** do not assume marketplace catalog APIs expose review text; preserve sample denominator and sampling method; review samples are not automatically representative; retain text only under applicable rights and retention rules.

### D05 — Demand, trends, and category intelligence

**Research questions:** Is interest rising or falling? Which keywords, needs, and use cases show momentum? How does interest differ across markets?

**Subdomains**
- Search interest and keyword trends: Google Trends (including limited-access API programs), DataForSEO, Baidu.
- Paid search planning and advertising keyword signals: Google Ads, Baidu Marketing.
- Category and web traffic intelligence: Similarweb, Semrush, Ahrefs and vetted alternatives.
- Marketplace category/rank/listing observations where permitted.
- Seasonality, geography, and historical trend series.

**Typical evidence:** metric name and definition, value, unit, geography, query/category, time window, sampling method, source and timestamp.

**Important distinctions:** trend indices, search volume, traffic estimates, ad competition, ranking, and listing counts are proxies. Never relabel them as sales, revenue, or market size without a valid measured source and methodology.

### D06 — Supplier, manufacturing, and sourcing intelligence

**Research questions:** Who can manufacture or supply the product? What are indicative MOQ, specification, lead time, and quoted price conditions? Can claims be verified?

**Subdomains**
- B2B marketplaces: 1688, Alibaba.com and approved platforms.
- Supplier directories and licensed manufacturer databases.
- RFQ, quotation, sample, and factory-audit workflows.
- User-uploaded supplier quotations, datasheets, certificates, and correspondence.

**Typical evidence:** supplier identity, product/specification, MOQ, currency, price tier, Incoterms, lead time, sample status, quotation date, certification evidence, verification status.

**Important distinctions:** advertised price is not landed cost; supplier profile claims are not independently verified; distinguish manufacturer, trading company, distributor, and reseller where evidence supports it.

### D07 — Company, brand, and competitive intelligence

**Research questions:** Who owns a brand? Which companies compete in the category? What are their product portfolios, channels, geographic presence, and public business signals?

**Subdomains**
- Company registries and official business sources.
- Brand/product catalogs and corporate websites.
- Licensed company enrichment and firmographic providers.
- Public filings, press releases, patents, and corporate announcements.

**Typical evidence:** legal/company name, brand relationships, jurisdiction, company identifiers, official domains, product portfolio, public filings, source date.

**Important distinctions:** distinguish legal entities from brands and storefronts; enrichment data may be estimated or stale; observe privacy and database licensing requirements.

### D08 — Technical specifications, standards, and certification intelligence

**Research questions:** What specifications are technically meaningful? Which standards and certifications apply? Are supplier or marketing claims supported?

**Subdomains**
- Standards bodies and official technical specifications.
- Certification and conformity databases.
- Manufacturer datasheets and product documentation.
- Patent databases and technical publications.
- Authorized test laboratories and user-provided test reports.

**Typical evidence:** standard identifier/version, requirement, certification ID, issuer, product/model scope, test method, issue/expiry date, document reference.

**Important distinctions:** a marketing claim is not certification; connector shape does not prove protocol or power capability; record whether a claim is verified, observed, inferred, or unverified.

### D09 — Pricing, promotion, and commercial intelligence

**Research questions:** How do observed prices vary by seller, market, variant, time, promotion, shipping, and wholesale quantity?

**Subdomains**
- Marketplace and retailer price observations.
- Promotion/coupon and advertised-price feeds where permitted.
- Wholesale price tiers and supplier quotations.
- Currency conversion and tax/shipping reference data.

**Typical evidence:** amount, currency, price type, promotion state, seller, quantity/MOQ, shipping/tax inclusion, market, timestamp, source.

**Important distinctions:** separate list price, sale price, coupon-adjusted price, wholesale quote, and landed-cost estimate; retain currency and collection time.

### D10 — Logistics, trade, and market-access intelligence

**Research questions:** What affects delivery cost, import feasibility, lead time, tariffs, and market entry?

**Subdomains**
- Official customs/tariff and trade databases.
- Freight, shipping, and logistics providers.
- Public trade statistics and import/export datasets.
- Tax, product compliance, and market-entry reference sources.

**Typical evidence:** HS code candidate, jurisdiction, tariff rate and effective date, freight quote, route, Incoterms, delivery estimate, source and assumptions.

**Important distinctions:** HS classification requires validation; trade statistics are not brand-level sales; freight quotes are time-sensitive and route-specific.

### D11 — AI, enrichment, and analytical service providers

This is an enabling integration family, not a primary market-evidence source.

**Subdomains**
- Reasoning and report generation models.
- Chinese/multilingual models.
- Structured extraction and classification.
- Embeddings, reranking, translation, OCR, and vision.
- Entity resolution, deduplication, and data enrichment.
- Search orchestration and AI observability/routing.

**Typical evidence/telemetry:** provider/model/version, capability, region, latency, token/compute usage, cost, schema validation, quality score, prompt/schema version.

**Important distinctions:** AI output is derived analysis, not source evidence; preserve citations/evidence spans, support abstention, and never let an AI provider silently manufacture missing facts.

### D12 — First-party and user-provided data

This is a first-class source domain and a critical fallback when third-party APIs are unavailable.

**Subdomains:** CSV/XLSX/JSON imports, customer surveys, support/return data, internal product catalogs, supplier RFQs/quotes, lab reports, and manually verified research records.

**Requirements:** source declaration, uploader/owner, lawful-use confirmation, import timestamp, schema mapping, PII detection/minimization, deduplication, provenance, retention and deletion policy.

## 3. Cross-cutting classification dimensions

Every provider and connector must be tagged along multiple independent axes:

1. **Domain:** one primary D01–D12 domain; optional secondary domains.
2. **Market:** China, global, country/region-specific, or unknown.
3. **Language:** supported input/output languages and locale coverage.
4. **Evidence entity:** product, variant, listing, seller, review, post, keyword, company, supplier, standard, price, shipment, etc.
5. **Access model:** public API, API key, OAuth, seller authorization, partner/ISV approval, research eligibility, paid licensed feed, user upload, or manual evidence.
6. **Evidence type:** observed, derived, estimated, inferred, or recommended.
7. **Rights status:** under review, approved, restricted, expired, or prohibited for the intended use.
8. **Operational status:** proposed, eligibility check, contract/approval pending, credentials pending, connected/tested, limited, disabled, or retired.
9. **Data freshness/history:** real-time, near-real-time, daily, periodic, on-demand; historical depth where verified.
10. **Commercial profile:** setup cost, subscription, usage pricing, quota, rate limit, overage, and estimated cost per study.
11. **Retention/display:** storage period, deletion obligations, attribution, excerpt/display limits, redistribution restrictions.
12. **Quality/reliability:** field completeness, coverage, freshness, error rate, source lineage, and fallback.

A provider may belong to multiple domains, but each returned record must retain its actual evidence type and source lineage.

## 4. Standard provider research dossier

Before selecting or implementing a provider, complete one dossier:

| Field | Required content |
|---|---|
| Provider and product | Legal/provider name, exact API product and version |
| Domain/subdomain | D01–D12 and specific capability |
| Official documentation | Documentation and developer registration URLs |
| Access and eligibility | Account type, region, approval, seller/partner/research qualification |
| Authentication | API key/OAuth/signed request/authorized export and required scopes |
| Endpoint and entities | Exact endpoints, entities, fields, pagination and filters |
| Market/language coverage | Confirmed coverage, not marketing assumptions |
| Sample evidence | Sanitized real response or clearly labeled synthetic fixture |
| Limits and reliability | Quotas, rate limits, history, latency, SLA/status page |
| Pricing | Setup, subscription, usage, overage, currency, estimate per study |
| Rights and compliance | Collection, storage, analysis, display, attribution, redistribution, deletion |
| Data quality | Completeness, freshness, known gaps, source lineage |
| Security | Credential handling, scopes, data location, subprocessors if relevant |
| Decision | Primary / secondary / fallback / later / reject, with rationale |
| Review owner/date | Reviewer, evidence links, next review date |

A documentation page alone does not prove eligibility, production access, data coverage, or commercial-use rights.

## 5. Provider evaluation and prioritization

Score each candidate from 1–5 with evidence for:
- Access certainty and time to approval.
- Legal and contractual fitness for the intended use.
- Required entity/field coverage.
- China/global and language coverage.
- Freshness and historical depth.
- Provenance and auditability.
- Reliability, quotas, pagination, and operational complexity.
- Total cost per usable record and per completed study.
- Retention, attribution, and display constraints.
- Independence and complementarity versus existing providers.

Apply hard gates before weighted scoring: legal permission, account eligibility, security, and sufficient required fields. A high numeric score cannot override a failed hard gate.

Prioritize a portfolio with:
- **Primary source:** strongest fit for the required evidence.
- **Cross-check source:** independent corroboration for high-impact claims.
- **Fallback source:** alternate provider or user upload when the primary is unavailable.
- **Deferred source:** useful but not justified for the current phase.
- **Rejected source:** unsuitable due to rights, eligibility, coverage, cost, or quality.

## 6. Configuration Center information architecture

The frontend Settings → Integrations area should be organized by D01–D12 domains, with a global provider search and filters for market, access model, status, and capability.

Each provider card should show:
- Provider/API product and domain.
- Supported market, language, entities, and capabilities.
- Access model and eligibility requirements.
- Connection and rights-review status as separate indicators.
- Official documentation link.
- Credential/scopes checklist and server-side connection test.
- Pricing/quota/rate-limit notes.
- Last successful test, last used, freshness, and redacted error.
- Enable/disable controls, market scope, study-level opt-in, budget and rate limits.
- Data retention, attribution, display restrictions, and review owner.

Do not use one generic "Connected" state to imply that commercial rights, field coverage, or all markets have been approved.

## 7. Initial USB Cable research portfolio mapped to domains

| Domain | Initial research need | Candidate route (subject to verification) |
|---|---|---|
| D01 E-commerce | Global and China catalog, variants, observed listing prices | eBay Browse; eligible Amazon route; approved Taobao/Tmall or 1688 route |
| D02 Search | English/Chinese keywords, SERP and competitor discovery | DataForSEO or Google Ads + separately approved SERP; Baidu route if eligible |
| D03 Social | Public discussion, creator demonstrations, use cases | YouTube Data API; Reddit/X/TikTok or China platforms only where permitted |
| D04 Reviews | Durability, charging, compatibility, overheating, connector failures | User-authorized review exports first; licensed/official access after rights review |
| D05 Demand | Keyword trend and category interest | Google Ads, Trends access if granted, DataForSEO, Baidu if eligible |
| D06 Supplier | MOQ, quote, material, lead time, manufacturer capability | Authorized 1688/Alibaba.com access; RFQ and quote uploads |
| D07 Company/brand | Brand and competitor portfolio | Official brand/company sources and vetted enrichment |
| D08 Technical | USB protocol, power, data rate, certification claims | USB-IF and relevant official standards/certification sources; manufacturer datasheets |
| D09 Pricing | Retail/wholesale price bands and promotion history | Permitted listing snapshots plus dated supplier quotes |
| D10 Logistics/trade | Import duties, shipping and landed-cost assumptions | Official tariff/trade sources and logistics quotes |
| D11 AI | Chinese/English extraction, review clustering, synthesis and verification | Benchmark provider-neutral primary/fallback models |
| D12 First-party | Review exports, supplier quotes, samples and test results | Secure CSV/XLSX/JSON import and evidence registration |

USB Cable-specific extraction must keep connector type, protocol generation, data rate, power rating, cable length, e-marker, material, and certification as separate fields. A USB-C connector alone does not prove USB4, Thunderbolt, a particular charging wattage, or a data rate.

## 8. Delivery sequence

### Stage A — Taxonomy and inventory
- Adopt D01–D12 as the provider registry taxonomy.
- Inventory all candidate providers from `INTELLIGENCE-SOURCES.md` and map each to domain/subdomain.
- Identify gaps by research question and required evidence entity.

### Stage B — Provider due diligence
- Complete dossiers for priority candidates.
- Verify official documentation, eligibility, access, pricing, field coverage, rights, quotas, retention and sample payloads.
- Mark unresolved facts explicitly; do not assume access.

### Stage C — Portfolio selection
- Select primary, cross-check, fallback, deferred, and rejected providers per domain.
- Choose a minimum viable evidence portfolio for the first USB Cable study.
- Approve costs and contractual obligations before paid integration.

### Stage D — Connector and product implementation
- Implement domain-agnostic connector contracts and provider-specific adapters.
- Normalize to canonical entities while preserving raw values and provenance.
- Expose provider configuration and operational status in the frontend.
- Add tests using synthetic fixtures and sanitized provider samples.

### Stage E — Operational review
- Measure coverage, quality, freshness, cost, failure rate, and study usefulness.
- Revisit provider decisions as API products, pricing, access policies, and eligibility change.

## 9. Non-negotiable rules

1. Never scrape, bypass authentication, evade paywalls, or circumvent technical controls or rate limits.
2. Never equate public visibility with permission to collect, store, analyze, or redistribute.
3. Never claim an API is available until access and the required fields are verified.
4. Never represent estimated or proxy metrics as measured sales or market size.
5. Preserve source, timestamp, market, metric definition, rights, and transformation lineage.
6. Keep provider credentials server-side, encrypted, masked, scoped, and audited.
7. Separate AI-derived analysis from source observations and require human approval for consequential decisions.
8. Design the taxonomy and canonical data model to support new product categories without schema rewrites.
