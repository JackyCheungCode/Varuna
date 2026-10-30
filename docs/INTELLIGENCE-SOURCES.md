# Varuna Intelligence Source and API/AI Integration Plan

Status: Planning baseline | Version: 0.1 | Date: 2026-10-30

## 1. Objective and design rule

Varuna must research China and international markets using multiple evidence classes. No single marketplace/search API is sufficient. The platform registry must distinguish:
- Official public/developer API.
- Official API requiring seller, partner, affiliate, research, or app approval.
- Licensed third-party data provider.
- User-authorized export or uploaded dataset.
- Manual/public-web evidence that is not an API and must not be represented as one.

A provider is not "available" merely because documentation exists. Each connector is tracked as Proposed, Eligibility check, Contract/approval pending, Credentials pending, Connected/tested, Limited, Disabled, or Retired. Coverage, field availability, quotas, cost, retention, attribution, and terms must be verified before enabling collection.

## 2. Intelligence layers and candidate platforms

### A. Search discovery and web visibility

| Market | Platform/provider | Candidate API | What it contributes | Planning notes |
|---|---|---|---|---|
| Global | Google Search | Google Programmable Search / approved search provider; DataForSEO SERP | Search result discovery, competitor pages, product terminology | Google Ads API is for keyword planning, not a general organic SERP API. Confirm current product eligibility/quotas before selection. |
| Global | Bing | Bing Search via an approved provider; DataForSEO SERP | Independent search coverage and cross-check | Avoid coupling the product to one search engine. |
| Global | Google Ads | Google Ads API Keyword Planning | Keyword ideas, historical search volume, competition and forecast metrics | Search/ad metrics are demand signals, not product sales. Access and quota apply. |
| Global | Google Trends | Google Trends API Alpha, if accepted; otherwise licensed provider or manually sourced UI evidence | Relative interest over time and geography | Alpha access is limited; do not build a production dependency on it until access is granted. |
| China | Baidu Search | Baidu Marketing/推广 API where account and permission qualify; licensed SERP provider | Chinese keyword and search result discovery | Confirm account eligibility, API scope, and whether the desired data is exposed. |
| China | 360 Search / Sogou | Licensed search data provider where available | Alternative search coverage | Treat as optional until a compliant provider and coverage are validated. |
| Both | DataForSEO | SERP, Keywords Data, Google Trends Explore and related endpoints | One vendor adapter for search visibility and keyword signals | Paid third-party aggregator; compare price, freshness, geography, terms, and coverage before purchase. |

### B. Marketplace and product/competitor catalog

| Market | Platform | Candidate API / access route | Data contribution | Important limitation |
|---|---|---|---|---|
| Global | Amazon | Selling Partner API (Catalog Items, Product Type Definitions); Creators API where eligible | Catalog identifiers, titles, brand, category, images, attributes/variations depending on endpoint | SP-API is primarily seller/vendor-authorized operational data, not unrestricted public marketplace intelligence. Creators API has Associates eligibility and usage requirements. Public review corpus access must not be assumed. |
| Global | eBay | Buy Browse API | Search listings, item details, aspects, price, condition, marketplace and variations | Production access may be subject to eligibility/limited release. Listing price is not realized transaction price. |
| Global | Walmart | Marketplace Item Search API | Published catalog item lookup by keyword and product identifiers | Check geographic scope and API eligibility; published items only in documented search. |
| Global | AliExpress | AliExpress Open Platform / affiliate or partner APIs where approved | Product discovery and catalog/affiliate fields | API permissions, commercial use, region, and returned fields vary by program. |
| Global | Alibaba.com | Alibaba.com Open Platform / GGS APIs | B2B supplier and product sourcing information | Requires developer/app registration and approved permissions; seller authorization may be required. Not a substitute for consumer demand. |
| China | Taobao / Tmall | Alibaba Open Platform (TOP), approved product/search/item APIs and authorized service-market providers | Domestic product listings, categories, SKU and product attributes within granted scope | Public and seller-authorized endpoints differ; some APIs are restricted to authorized seller sessions or specific app scopes. Do not assume universal search/review access. |
| China | 1688 | 1688 Open Platform / authorized ISV or data partner | Wholesale supply, supplier, MOQ, price bands, specifications | Supplier/partner permission and commercial scope must be confirmed. |
| China | JD.com | JD Open Platform product/search APIs or approved data partner | Retail product/catalog, category and price observations where permitted | Confirm current public/partner API products and approval; don't assume broad public review access. |
| China | Pinduoduo | Pinduoduo Open Platform / approved partner | Product and merchant data within granted scopes | Access commonly depends on app/merchant/partner relationship; treat as approval-gated. |
| China | Douyin E-commerce | Douyin E-commerce Open Platform / approved service-provider APIs | Product catalog and commerce signals within authorized scope | Seller/shop authorization and scope limitations; separate from general public video research. |
| Both | Licensed commerce data providers | e.g. DataForSEO product/merchant endpoints or a vetted marketplace intelligence vendor | Cross-marketplace discovery and normalized snapshots | Vendor diligence required: source lineage, permitted use, review licensing, refresh frequency, regional coverage, and redistribution rights. |

### C. Reviews, customer voice, and product pain points

| Market | Source | Candidate API/access | Contribution | Access caveat |
|---|---|---|---|---|
| Global | Amazon | Seller-authorized reports/data, licensed review-data provider, or user-uploaded export | Product feedback and recurring defects when lawfully available | Do not assume SP-API or Creators API grants unrestricted public review text. |
| Global | eBay / Walmart | Official API fields if exposed, seller-authorized exports, or licensed provider | Ratings/review counts and permitted feedback fields | Field-level availability and reuse rights vary. |
| Global | Reddit | Reddit Data API under current developer terms and approved use | Detailed user discussions, complaints, comparisons, recommendations | API access, rate limits, retention and commercial use rules must be reviewed. |
| Global | YouTube | YouTube Data API v3 (videos, channels, comments where exposed) | Unboxing, comparison, durability tests, comment themes | Quota and API policies apply; comments are not representative population surveys. |
| Global | TikTok | Research API only if the organization/project qualifies; Commercial Content API for its documented scope | Public content signals and commercial content transparency | Research API access is restricted to eligible researchers/regions/organizations; not a general-purpose unrestricted commercial firehose. |
| Global | X | X API under the selected paid tier and terms | Public discussion and product mentions | Cost, access tier, history and rate limits may be substantial. |
| China | Bilibili | Official open platform APIs or approved partner route | Reviews, teardown, testing and comments where accessible | Verify scopes and commercial use; do not assume arbitrary comment search. |
| China | Zhihu | Official/authorized data partner or user-provided exports | Long-form experience and comparison discussions | No dependency until compliant access and rights are verified. |
| China | Xiaohongshu | Official/approved commercial or partner APIs where applicable; licensed social listening vendor | Lifestyle use cases, product recommendations and complaints | Public developer access is not equivalent to unrestricted search/crawl. Require provider and content-use review. |
| China | Douyin | Open Platform / E-commerce partner APIs; eligible research access if applicable | Short video, creator/product signals and commerce content | Distinguish commercial APIs, creator-authorized data, and restricted research APIs. |
| Both | Customer-supplied data | CSV/XLSX/JSON import with source declaration | Reviews, survey responses, support tickets, returns/defect records | Strong first-release option when platform APIs do not provide review text. Require lawful rights and PII minimization. |

### D. Demand, category, and trend signals

- Google Ads API Keyword Planning: keyword ideas, historical metrics, competition, forecasts.
- Google Trends API Alpha: apply for access; fallback to a licensed Trends data provider.
- DataForSEO Keywords Data / Trends endpoints: country/language-specific keyword signals.
- Baidu Marketing API: Chinese search keyword planning where approved.
- Marketplace observations: price bands, listing counts, rank and availability where a permitted source exposes them.
- Google Shopping / Merchant data: only via documented eligible APIs/feeds and approved provider access.
- Similarweb, Semrush, Ahrefs: optional paid competitive/search intelligence, with contract and metric definitions checked.

These are proxies. Search volume, ad competition, ranking, listing count, views, likes, and review count must never be silently converted into unit sales or market size.

### E. Supply chain, specification, and feasibility

- 1688 and Alibaba.com authorized product/supplier data for factory-side price/MOQ/lead-time signals.
- Global B2B directories and licensed supplier databases after vendor due diligence.
- User-provided RFQs, quotations, samples, datasheets, compliance certificates, and factory responses.
- Optional standards/compliance references from authoritative standards bodies and certification databases.

Supplier asking price is not a verified landed cost. Record currency, MOQ, Incoterms, shipping, tax, sample status, quotation date, and verification status separately.

## 3. AI provider and model plan

AI is a reasoning/normalization layer over evidence, not a substitute for source data. Implement a provider-neutral model router. Do not hard-code a single vendor into business logic.

| AI capability | Primary design | Candidate providers/models | Required controls |
|---|---|---|---|
| Research planning and synthesis | Strong reasoning model | OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Qwen | Structured plan schema, source citation requirements, human approval |
| Chinese-language analysis | Chinese/ multilingual model evaluation pool | Qwen, DeepSeek, Gemini, OpenAI, Claude | Benchmark simplified/traditional Chinese, terminology, sarcasm, mixed-language reviews |
| Product/spec extraction | Low-cost structured extraction model | Gemini, OpenAI, Qwen, DeepSeek, Workers AI models | JSON schema validation, unit normalization, evidence spans, confidence and abstention |
| Review classification at scale | Batch-capable low-cost model; escalation to stronger model | Qwen, DeepSeek, Gemini, OpenAI, Workers AI | Deduplication, bounded batches, per-language quality benchmark, cost ceiling |
| Embeddings and clustering | Embedding model selected by language and domain | OpenAI embeddings, Google embeddings, multilingual/open models on Workers AI or approved inference | Separate Chinese and multilingual evaluation; version embeddings |
| Web/source summarization | Search provider plus model with citations | Search API + OpenAI/Claude/Gemini | Model may summarize retrieved evidence but cannot invent source records |
| Image/spec sheet understanding | Vision-capable model | OpenAI, Gemini, Claude where supported | Preserve image provenance; mark visual inference as inferred |
| Independent verification | Second provider or deterministic checks | Different model family plus rules/tests | Use disagreement flags, not majority vote as proof |

### Recommended provider architecture

1. Cloudflare AI Gateway as a centralized routing/observability layer where compatible; it documents unified routing to OpenAI, Anthropic, Google AI Studio, Workers AI, Bedrock and other providers.
2. Start with one primary model provider and one fallback provider, selected after a representative Chinese/English benchmark and cost test.
3. Keep a low-cost extraction model separate from the high-reasoning planner/report model.
4. Support per-capability model selection, per-study overrides, max tokens, timeout, retry, fallback, monthly/org/study budgets, and model disable switches in the frontend Configuration Center.
5. Store provider, model ID, prompt version, schema version, token usage, latency, cost, and output validation result for every AI run.
6. Never let a model autonomously invent market data, claim sales volume, or approve its own high-impact recommendation.

## 4. Recommended phased integration portfolio

### Phase 0 — Before connector coding
- Confirm provider eligibility, official docs, account/app approval, legal/contract rights, pricing, quotas, regions, and data retention.
- Create a source capability matrix with exact fields and entity coverage.
- Collect sample responses and test credentials.
- Decide which sources are primary, cross-check, and optional.
- Create synthetic fixtures so development does not depend on paid credentials.

### Phase 1 — Minimum viable research evidence (first USB Cable study)
Recommended initial set:
1. One global search/keyword provider: DataForSEO OR Google Ads API plus a separately approved SERP source.
2. One China search source: Baidu Marketing API if eligible; otherwise a vetted licensed provider.
3. One global marketplace source: eBay Browse API, subject to production access approval; Amazon Catalog/Creators route only if eligible and appropriate.
4. One China commerce source: approved Taobao/Tmall or 1688 partner route; do not assume approval. If unavailable, import a user-authorized structured sample.
5. One B2B supplier source: Alibaba.com Open Platform or 1688 authorized access.
6. One social/video source: YouTube Data API; TikTok only if the intended API program and eligibility fit.
7. Review dataset: user-uploaded CSV/XLSX first, plus one licensed review provider after rights and coverage are checked.
8. One primary AI provider + one fallback; one embedding model.

### Phase 2 — Broader competitive coverage
- Amazon, Walmart, AliExpress, JD, Pinduoduo, Douyin E-commerce, Bilibili, Xiaohongshu and Reddit/X connectors only after approval/contract and field-level review.
- Add Similarweb/Semrush/Ahrefs or other paid market-intelligence tools where their unique data justifies cost.
- Add a second independent source for important product attributes and price observations.

### Phase 3 — Enterprise-grade intelligence
- Multi-provider redundancy, source quality scoring, scheduled snapshots, historical trend series, supplier quotation workflow, evaluation datasets, and automated anomaly detection.
- Add market-specific adapters without changing canonical product/review schemas.

## 5. Connector selection scorecard

Score each candidate 1–5 and record evidence:
- Access certainty and approval lead time.
- Legal/contractual permission for intended collection, storage, analysis, and report display.
- China/global and language coverage.
- Required field coverage: title, brand, GTIN/ASIN/platform ID, price/currency, category, attributes, variants, rating, review count/text, timestamp, seller, availability.
- Freshness, historical depth, pagination, bulk/export support.
- Rate limits, quotas, reliability, latency.
- Cost per 1,000 usable records and cost per completed study.
- Provenance and source-link availability.
- Retention, deletion, attribution, redistribution restrictions.
- Operational burden and fallback availability.

Do not select a connector based only on its marketing claim that it has "all marketplace data".

## 6. Canonical data and measurement requirements

Normalize all providers into common entities while preserving raw source values:
- Product identity: GTIN/EAN/UPC where present, platform IDs, brand, model, canonical product and variant.
- Attribute observations: raw value, normalized value, unit, source, timestamp, extraction method, confidence, verification.
- Price observations: amount, currency, promotion state, shipping/tax inclusion, market, timestamp, seller, MOQ if wholesale.
- Demand observations: metric name, exact definition, source, period, geography, keyword/category, unit and sampling method.
- Reviews: source review ID, text only where licensed, language, date, rating, product variant, evidence span, derived aspects/topics/sentiment.
- Provenance: provider, endpoint/version, collection timestamp, source URL/ID, rights/retention policy, raw checksum/object reference, parser version.

Never merge unlike metrics into a single "sales" number. A dashboard must show the original metric, source, period, sample size, geography, and caveat.

## 7. Frontend Configuration Center requirements

Each provider card must expose:
- Provider name, family, supported markets/languages, data entities and capabilities.
- Access model: API key, OAuth, seller authorization, partner approval, research eligibility, or file import.
- Official documentation and developer registration links.
- Required credentials and scopes (masked after save).
- Connection test, last successful test, status, quotas, rate limits, pricing notes, and last error (redacted).
- Enable/disable by organization and market; per-study opt-in.
- Data retention, attribution, allowed fields, and contract review status.
- AI provider: model list, capability support, context/output limits if known, routing priority, fallback, temperature/structured output settings where applicable, budget, and timeout.

The UI must not imply that a restricted API can be enabled with only an API key. Approval/contract/eligibility states are first-class states.

## 8. Initial USB Cable research coverage

Search synonyms in English and Chinese, then normalize to the category taxonomy:
- USB-C to USB-C, USB-A to USB-C, USB-A to Lightning, USB-C to Lightning, USB4, Thunderbolt-compatible claims.
- Charging wattage and PD/PPS/QC claims.
- Data rate and protocol generation.
- Cable length, material, braid, flexibility, connector housing, display/LED, e-marker, right-angle connector.
- Price bands, pack size, warranty, brand, seller, target device/use case.
- User pain points: slow charging, overheating, durability, connector breakage, loose fit, data transfer, compatibility, length, stiffness, misleading wattage claims.

Keep charging power, data protocol/rate, and compatibility as distinct attributes. Flag claims that need independent technical verification.

## 9. Official references checked for this planning baseline

- Amazon SP-API reference: https://developer-docs.amazon/sp-api/reference/welcome-to-api-references
- Amazon Creators API: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction
- eBay Browse API: https://developer.ebay.com/develop/api/buy/browse_api
- Walmart Item Search: https://developer.walmart.com/us-marketplace/reference/getsearchresult
- Alibaba.com Open Platform: https://openapi.alibaba.com/doc/doc.htm
- Taobao Open Platform product API catalog: https://developer.alibaba.com/docs/api_list.htm?cid=4&docType=4
- Google Ads API Keyword Planning: https://developers.google.com/google-ads/api/docs/keyword-planning/overview
- Google Trends API Alpha: https://developers.google.com/search/apis/trends
- DataForSEO Keywords Data: https://docs.dataforseo.com/v3/keywords-data-overview/
- TikTok Research API: https://developers.tiktok.com/products/research-api/
- YouTube Data API: https://developers.google.com/youtube/v3/docs/
- Cloudflare AI Gateway: https://developers.cloudflare.com/ai-gateway/get-started/
- OpenAI Responses API: https://developers.openai.com/api/reference/responses/overview

This is a candidate plan, not a claim that all listed APIs are open, approved, free, or suitable for unrestricted commercial reuse. Revalidate provider documentation, terms, pricing, and eligibility at implementation time.
