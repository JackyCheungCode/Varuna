# Varuna Quick Start

## 1. Open the preview application

- Branch preview: `https://docs-product-foundation.varuna-cu7.pages.dev`
- API Worker: `https://varuna-api.xg-y.workers.dev`
- Supabase project: `dnvcmvfexaucyjlvtvbm` (EU West)

The production branch is still `main`. This preview is isolated from production.

## 2. Create an account

1. Open the preview URL and choose Sign up.
2. Use an email address and password.
3. If Supabase email confirmation is enabled, confirm the email.

Supabase Auth redirect allowlist must include the preview hostname. Recommended Auth URL Configuration:
- Site URL: `https://docs-product-foundation.varuna-cu7.pages.dev`
- Redirect URL: `https://docs-product-foundation.varuna-cu7.pages.dev/**`
- Optional preview deployments: `https://*.varuna-cu7.pages.dev/**`

If confirmation links redirect to an error page, check these Supabase Auth URL settings. Do not disable email verification just to bypass the redirect.

## 3. Create a research project

Open Research Projects and create a project. Example:
- Project: USB-C Cable Opportunity Research
- Subject: USB-C charging and data cables
- Markets: CN and US / Global
- Decision intent: identify underserved segments, product specifications and target price bands

The project is stored in Supabase under your workspace.

## 4. Configure AI providers

Open Configuration Center. Expand an AI provider and enter:
- API key (or JSON credentials for account-based providers)
- Model ID exactly as shown by the provider
- Optional HTTPS-compatible base URL

Supported AI generation adapters:
- OpenAI
- Anthropic
- Google Gemini
- DeepSeek
- Qwen / DashScope compatible endpoint
- Cloudflare Workers AI

The system encrypts credential JSON in the Worker and stores ciphertext in the EU KV namespace. The browser never receives saved credentials. Model IDs are account- and region-dependent; Varuna does not guess them.

## 5. Configure data sources

Recommended first sources:

### YouTube Data API
Enter a Google Cloud API key. Enable YouTube Data API v3 in the Google Cloud project. Test the connection, then use the project action **Collect YouTube**.

### eBay Browse API
Paste a JSON object into the credential field:
```json
{
  "client_id": "YOUR_EBAY_APP_ID",
  "client_secret": "YOUR_EBAY_CERT_ID",
  "environment": "production"
}
```
Choose `sandbox` only for sandbox credentials. Test OAuth, then use **Collect eBay**. Production Browse API eligibility may be separate from OAuth success.

### DataForSEO
Paste:
```json
{
  "username": "YOUR_DATAFORSEO_LOGIN",
  "password": "YOUR_DATAFORSEO_PASSWORD"
}
```
Test the connection, then use **Collect Google SERP**. SERP results are location/language-specific snapshots.

### Google Ads Keyword Planner
Paste:
```json
{
  "developer_token": "YOUR_DEVELOPER_TOKEN",
  "client_id": "YOUR_OAUTH_CLIENT_ID",
  "client_secret": "YOUR_OAUTH_CLIENT_SECRET",
  "refresh_token": "YOUR_OAUTH_REFRESH_TOKEN",
  "customer_id": "1234567890",
  "login_customer_id": "1234567890",
  "currency_code": "USD"
}
```
Test account access, then use **Collect Google Keywords**. OAuth consent must include the Google Ads scope. A developer token and customer account must be eligible for the requested API access.

### Cloudflare Workers AI
Paste:
```json
{
  "account_id": "YOUR_CLOUDFLARE_ACCOUNT_ID",
  "api_token": "YOUR_SCOPED_API_TOKEN"
}
```
Enter a supported Workers AI model ID in the model field.

### Reddit
Reddit requires explicit API access approval before data access. Only after approval, paste:
```json
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "user_agent": "VarunaResearch/1.0 (contact: your-email)",
  "approved_access": true
}
```
Do not set `approved_access` to true before approval. Reddit evidence remains rights-restricted until permitted commercial use and retention are confirmed.

## 6. Generate a research plan

Open Research Projects and select **Generate Research Plan**. Varuna uses the configured AI provider to produce research questions, workstreams, source suggestions, coverage requirements and stopping conditions. It stores a research run and workstream tasks in Supabase.

This step creates a plan; it does not mean every task has been executed. Queue consumers and more provider adapters are still being built.

## 7. Evidence interpretation

- YouTube views, likes and comments are platform engagement, not sales.
- eBay prices are asking/listing prices, not completed transaction prices.
- Google Ads average monthly searches and bid metrics are planning estimates, not sales.
- SERP rank is a location- and time-specific search snapshot.
- Reddit posts are relevance-ranked and non-representative; data use is subject to explicit approval and terms.

Every report must keep source, sample, date, region, method, rights and limitations visible.
