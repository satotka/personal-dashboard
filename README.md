# Pocket — 今日を、ひと目で。

Mobile-first market, financial-service links and News mockup. Preserve existing Site owner-only access. No account, asset, income or transaction data is acquired. Previous /api/data endpoint is removed. Browser outbound data connections disabled by CSP.

Quotes, changes, charts and News titles are explicitly fictional examples. Bank/brokerage links are placeholders and do not assert account ownership. Outbound links open official homepages, not fictional news articles. Source code contains no financial user data.

Market filters, chart time ranges, News filters and customization dialog work in browser. Configuration is in src/index.html. No external packages or data connections. Build: npm run build. Tests: npm test. Output: dist/index.js and dist/wrangler.json.

## Market data

GET /api/markets fetches Yahoo Finance chart JSON for ^N225 and JPY=X, daily records up to ten years. HTML contains no market snapshot; frontend requests the endpoint. Cache API holds data for seven days and revalidates after 24 hours on access. Failed fetches retain prior data if present and retry after one hour. Cache is regional and evictable: a cold cache can fetch earlier than 24h. This is not a global exactly-once scheduler. Browser requests again after cache expiry while open; no unattended schedule is configured, per user preference. Source terms/availability can change; endpoint is not a contracted service. No artificial market values are displayed on failure. Weather, News and Gmail remain explicitly fictional.

## Current integrations

Market ranges: 4W (28 days), 365D, 10Y (3650 days), for both Nikkei and USD/JPY. Weather now uses JMA Kanagawa eastern regional forecast rather than Open-Meteo; no current temperature is fabricated. Server storage is Sites R2 binding BUCKET, not the unavailable default Cache API.

Company News uses Google News RSS exact-name search over the past seven days, six-hour R2 cache and one-hour retry on errors. This is related news search, not a complete official announcement inventory; deduplication by article URL and date filtering apply. Counts indicate retrieved search results. News collection not yet verified in production.

Gmail remains disconnected: no fictional counts are displayed. ChatGPT's Gmail connection does not establish hosted Sites eligibility; required eligibility discovery tool is unavailable. No mail contents or account data are embedded in releases.

## Diagnostics

Expand 接続状況・診断ログ at the bottom. GET /api/diagnostics reads only latest R2 records, without triggering provider requests. Normal /api/markets, /api/weather, /api/news calls record source state, cache use, actual attempt and success timestamps, upstream HTTP status, request duration, count, data date, retry time and a UUID trace ID. source_diagnostic structured logs use the same ID; api_failure logs capture uncaught infrastructure failures. No article bodies, account identifiers, cookies or tokens are logged. Cached failure is distinct from successful zero results. Latest per-source records are persisted under diagnostics/latest in R2; execution-log retention follows Sites. Opening diagnostics before the first API finishes may show unconfirmed until reload.
