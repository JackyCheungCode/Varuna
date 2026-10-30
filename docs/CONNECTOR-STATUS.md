# Varuna Connector Implementation Status

This document separates catalog availability from actual implementation. A provider shown in Configuration Center is not automatically an operational connector.

## Live implementation

| Provider | Credential format | Connection test | Data / AI capability |
|---|---|---|---|
| OpenAI | API key + model ID | Yes | Chat completions, research-plan generation |
| Anthropic | API key + model ID | Yes | Messages API, research-plan generation |
| Google Gemini | API key + model ID | Yes | GenerateContent, research-plan generation |
| DeepSeek | API key + model ID | Yes | OpenAI-compatible chat, research-plan generation |
| Qwen / DashScope | API key + model ID; optional compatible base URL | No dedicated test yet | OpenAI-compatible chat, research-plan generation |
| Cloudflare Workers AI | JSON: account_id, api_token, model ID | Yes | Workers AI inference and research-plan generation |
| Qwen / DashScope | API key + model ID; optional compatible base URL | Save supported; no dedicated test yet | OpenAI-compatible chat and research-plan generation |
| Cloudflare Workers AI | JSON: account_id, api_token, model ID | Yes | Workers AI inference and research-plan generation |
| YouTube Data API | API key | Yes | Public video search/details, source records and observations |
| eBay Browse API | JSON: client_id, client_secret, optional environment | OAuth test | Item search, listing price and product attributes |
| DataForSEO | JSON: username, password | Yes | Google organic SERP snapshot, rank and page observations |
| SerpApi | API key | Yes (free Account API; no search credit consumed) | Google web search, Shopping, News, Maps and Trends snapshots; normalized evidence records |
| Google Ads Keyword Planner | JSON: developer_token, client_id, client_secret, refresh_token, customer_id, optional login_customer_id | OAuth/account test | Keyword ideas, average monthly searches, advertising competition and bid ranges through Google Ads API v26 |
| Reddit API | JSON: client_id, client_secret, user_agent, approved_access:true | OAuth test after explicit approval | Public post search is approval-gated; commercial-use and retention rights remain restricted until confirmed |

## Additional live collection adapters

- YouTube Data API: search public videos and retrieve metadata/statistics; evidence is stored in the workspace with query, region, language and retention provenance.
- eBay Browse API: OAuth client-credentials and ranked item search; stores listing price, condition, seller and product attributes. Sandbox/production selection is supported.
- DataForSEO: authenticated Google organic SERP snapshot by keyword, location and language; stores rank and page observations.
- SerpApi: validates credentials through its free Account API; collects Google Search, Shopping, News, Maps and Trends engine results through a single Worker adapter, then stores normalized source and observation records with engine, locale, query and search ID provenance.

These are first adapters, not full-market coverage. Search results are samples; listing prices are asking prices; engagement metrics are not sales.

## Catalog-only / access-dependent

The following providers are registered in the catalog and can be securely configured, but a dedicated live collection adapter is not yet implemented:

- Amazon SP-API and Creators API
- Walmart Marketplace APIs
- Alibaba.com, 1688, Taobao/Tmall TOP, JD Open Platform, Pinduoduo Open Platform
- Bing Search, Baidu Marketing
- X API, Bilibili, TikTok Research API, Xiaohongshu partner access, Douyin Open Platform
- Similarweb, Semrush, Ahrefs, licensed pricing/promotion intelligence feeds
- Trade/customs datasets, standards/certification registries, company intelligence
- Authorized review imports, supplier quote imports, first-party business data imports

Credentials may be stored, but status remains configured until a dedicated authorization and connection test exists. TikTok Research API is research-institution restricted and must not be treated as a general commercial connector. Xiaohongshu and Douyin access must use official/approved channels. Marketplace seller data requires appropriate seller authorization and scopes.

## Security boundary

The browser sends credentials over HTTPS to `varuna-api`. The Worker authenticates the Supabase user, checks workspace role, encrypts credential JSON using AES-GCM with a Worker-only key, and stores ciphertext in the EU KV namespace. The browser receives only status and non-secret configuration metadata. Provider API responses are stored as evidence with provenance and rights/retention metadata.

## Current collection semantics

- YouTube views/likes/comments are engagement observations, not product sales.
- eBay Browse results are best-match listing samples; listing prices are asking prices, not completed transaction prices.
- DataForSEO and SerpApi SERP results are ranked search snapshots for a specified language/location; ranking is not sales or market share.
- SerpApi Shopping prices are displayed offer snapshots, Maps review metrics are platform signals, and Trends values are normalized interest indices; none is a direct sales measure.
- All provider data remains subject to the source provider's terms, retention, refresh, display, quota and commercial-use rules.

## Research task execution

Cloudflare Queues now consumes `varuna-research-tasks` with atomic task claiming, bounded retries, a configured `varuna-research-tasks-dlq`, and an encrypted short-lived user-scoped authorization reference stored in the existing EU KV vault. Workstreams are dispatched only to connected supported adapters (SerpApi, DataForSEO, Google Ads Keyword Planner, eBay Browse, YouTube Data API and approval-gated Reddit). Tasks without a tested supported adapter are persisted as `blocked` with an explanation. A dedicated DLQ inspection/redrive workflow and full run-level recovery dashboard remain outstanding.

## Next connector priorities

1. Complete DataForSEO keyword metrics and search-volume adapter with metric-definition metadata.
2. Implement Reddit authorized post search and review/theme ingestion.
3. Implement Amazon/eBay/Walmart marketplace adapters subject to production eligibility.
4. Implement China marketplace adapters only through approved Open Platform/ISV permissions.
5. Add supplier RFQ/quote import, standards/certification evidence and trade datasets.
6. Expand queue execution with dead-letter inspection/redrive, durable run aggregation and recovery dashboards.
7. Enable R2 only after account activation and retention/access policies are approved.
