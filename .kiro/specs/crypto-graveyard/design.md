# Design Document — Crypto Graveyard

## Overview

A static single-page web app (HTML, CSS, JavaScript, no build step, no server, GitHub Pages-ready). The same stack shape as the builder's previous static app: one `index.html`, one `styles.css`, one `app.js`, plus a `data.js` holding the graveyard entries and offline snapshots, and a `tests/` folder with Node unit tests and a Playwright end-to-end test.

## Architecture

```
crypto-graveyard/
  index.html        # page structure: header, fear/greed gauge, live prices, graveyard, watchlist, footer
  styles.css        # haunted visual system (dark, fog, moon, tombstones, candle glow)
  app.js            # fetch orchestration, rendering, watchlist, filters
  data.js           # dead-coin entries (UMD: same code in browser and Node) + offline snapshots
  tests/
    test_data.js    # unit tests: data integrity, band classification, formatting
    e2e.js          # Playwright: page loads, sections render, zero console errors
  .kiro/
    specs/crypto-graveyard/  # requirements.md, design.md, tasks.md
    steering/                # product.md, tech.md, structure.md
```

## Components and Interfaces

### Data layer (`data.js`)
- `DEAD_COINS`: array of entries `{ id, name, symbol, ripDate, peakPrice, peakDate, cause, story, lesson, source }`. Cause is one of `ponzi`, `depeg`, `rug`, `exchange`.
- `FALLBACK_PRICES`: top-10 snapshot `{ date, coins: [{ id, name, symbol, priceUsd, change24h }] }`.
- `FALLBACK_FEAR_GREED`: `{ date, value, label }`.
- `fearGreedBand(value)`: returns one of `extreme-fear`, `fear`, `neutral`, `greed`, `extreme-greed`.
- `formatPrice(n)`, `formatChange(n)`: display formatting, shared with the browser.

### Fetch layer (`app.js`)
- `fetchPrices()`: GET `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`. Timeout 8s via AbortController. On failure, use `FALLBACK_PRICES` and set the offline flag. **Verified live 2026-11-25: endpoint returns data from this machine.**
- `fetchFearGreed()`: GET `https://api.alternative.me/fng/?limit=1`. Timeout 8s. On failure, use `FALLBACK_FEAR_GREED`. **Verified live 2026-11-25: returned value 13, "Extreme Fear".**
- Both fetches run in parallel on load; each section renders independently so one failure does not block the other.

### Rendering
- Prices: a table-like list of 10 rows (rank, name/symbol, price, 24h change chip).
- Gauge: SVG semicircle with ticks for the five bands and a needle rotated by value. Needle angle maps 0–100 to -90°…+90°.
- Graveyard: grid of tombstone cards (CSS-shaped: rounded-top rectangle, engraved name). Click expands the story. Filter chips: All / Ponzi / Depeg / Rug pull / Exchange failure.
- Watchlist: rows with add (from price list) and remove buttons; persisted under localStorage key `graveyard-watchlist-v1`.
- Footer: data sources, snapshot labelling, "Educational only — not financial advice."

## Data Models

Dead-coin entries (all facts verifiable; sources noted in `data.js`):
- BitConnect (BCC) — Ponzi, shut down Jan 2018.
- Terra Luna (LUNA) — depeg/collapse, May 2022.
- FTX Token (FTT) — exchange failure, Nov 2022.
- Squid Game token (SQUID) — rug pull, Nov 2021.
- OneCoin (ONE) — Ponzi/fraud, exposed 2017–2019.
- Africrypt / Mirror Trading? — pick a sixth with a distinct cause (e.g. QuadrigaCX, exchange failure, 2019; or Iron Finance TITAN, depeg, Jun 2021). Final six chosen during implementation with sources.

## Correctness

- Every static figure in `data.js` carries a `source` string naming where it was verified.
- Unit tests assert: all 6+ entries have all fields; RIP dates parse; causes are from the allowed set; `fearGreedBand` boundaries (24/25, 49/50, 54/55, 74/75); price formatting.
- E2E test loads the page in headless Chromium and asserts: all four sections render, no console errors, clicking a tombstone expands it, adding to the watchlist persists across reload.

## Testing

- `node tests/test_data.js` — unit tests, must be 100% pass.
- `node tests/e2e.js` (Playwright, headless Chromium) — must pass with zero console/page errors.
- Manual check: load with network blocked and confirm both offline labels appear.
