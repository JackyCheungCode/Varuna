# Varuna Connector Implementation Status

This document separates catalog availability from actual implementation. A provider shown in Configuration Center is not automatically an operational connector.

## Live implementation

| Provider | Credential format | Connection test | Data / AI capability |
|---|---|---|---|
| OpenAI | API key + model ID | Yes | Chat completions, research-plan generation |
| Anthropic | API key + model ID | Yes | Messages API, research-plan generation |
| Google Gemini | API key + model ID | Yes | GenerateContent, research-plan generation |
| DeepSeek | API key + model ID | Yes | OpenAI-compatible chat, research-plan generation |
| Qwen / DashScope | API key + model ID; optional compatible base URL | Save supported; no dedicated test yet | OpenAI-compatible chat and research-plan generation |
| Cloudflare Workers AI | JSON: account_id, api_token, model ID | Yes | Workers AI inference and research-plan generation |
| YouTube Data API | API key | Yes | Public video search/details, source records and observations |
| eBay Browse API | JSON: client_id, client_secret, optional environment | OAuth test | Item search, listing price and product attributes |
| DataForSEO | JSON: username, password | Yes | Google organic SERP snapshot, rank and page observations |
| Reddit API | JSON: client_id, client_secret, optional user_agent | OAuth test | Credentials test only; collection adapter pending |

## Catalog-only / access-dependent

The following providers are registered in the catalog and can be securely configured, but a dedicated live collection adapter is not yet implemented:

- Amazon SP-API and Creators API
- Walmart Marketplace APIs
- Alibaba.com, 1688, Taobao/Tmall TOP, JD Open Platform, Pinduoduo Open Platform
- Google Ads Keyword Planning, Bing Search, Baidu Marketing
- X API, Bilibili, TikTok Research API, Xiaohongshu partner access, Douyin Open Platform
- Google Trends, Similarweb, Semrush, Ahrefs
- Trade/customs datasets, standards/certification registries, company intelligence
- Authorized review imports, supplier quote imports, first-party business data imports

Credentials may be stored, but status remains configured until a dedicated authorization and connection test exists. TikTok Research API is research-institution restricted and must not be treated as a general commercial connector. Xiaohongshu and Douyin access must use official/approved channels. Marketplace seller data requires appropriate seller authorization and scopes.

## Security boundary

The browser sends credentials over HTTPS to `varuna-api`. The Worker authenticates the Supabase user, checks workspace role, encrypts credential JSON using AES-GCM with a Worker-only key, and stores ciphertext in the EU KV namespace. The browser receives only status and non-secret configuration metadata. Provider API responses are stored as evidence with provenance and rights/retention metadata.

## Current collection semantics

- YouTube views/likes/comments are engagement observations, not product sales.
- eBay Browse results are best-match listing samples; listing prices are asking prices, not completed transaction prices.
- DataForSEO SERP results are ranked search snapshots for a specified language/location; ranking is not sales or market share.
- All provider data remains subject to the source provider's terms, retention, refresh, display, quota and commercial-use rules.

## Next connector priorities

1. Complete DataForSEO keyword metrics and search-volume adapter with metric-definition metadata.
2. Implement Reddit authorized post search and review/theme ingestion.
3. Implement Amazon/eBay/Walmart marketplace adapters subject to production eligibility.
4. Implement China marketplace adapters only through approved Open Platform/ISV permissions.
5. Add supplier RFQ/quote import, standards/certification evidence and trade datasets.
6. Wire Cloudflare Queues consumers with idempotency, retries, dead-letter handling and durable run state.
7. Enable R2 only after account activation and retention/access policies are approved.
