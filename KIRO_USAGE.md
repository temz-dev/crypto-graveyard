# How Kiro Was Used — Crypto Graveyard (Kiroween 2026, Costume Contest)

Factual record of how this app was built with Kiro, for the Devpost
"Kiro usage" write-up. All statements below were verified against the
project files and test runs on 2026-11-25.

## Tool

- **Kiro CLI 3.6.1**, run non-interactively from the project directory:
  `kiro-cli chat --no-interactive --trust-all-tools --trust-workspace`
  (with `--resume` to continue after interrupted sessions).
- Signed in with a free **Builder ID** (davvidson11@gmail.com), verified
  with `kiro-cli whoami`. No paid plan, no API keys anywhere in the app.

## Spec-driven workflow

Kiro implemented the app by working through the spec in
`.kiro/specs/crypto-graveyard/`, in task order:

- `requirements.md` — EARS-format requirements (6 requirements)
- `design.md` — architecture and component design
- `tasks.md` — 8 implementation tasks; **all 8 are marked done**
- `facts.md` — verified dead-coin facts with sources; the figures in
  `data.js` come exactly from this file (e.g. BitConnect peak $463)

Steering docs Kiro followed:

- `.kiro/steering/product.md`, `tech.md`, `structure.md`

Kiro did **not** change the content of any spec or steering file — the
only spec edit was checking off the task boxes in `tasks.md`.

## What Kiro built

| File | Size | What it is |
| --- | --- | --- |
| `index.html` | 7,410 bytes | Page shell: header with moon, gauge, prices, graveyard, watchlist, footer |
| `styles.css` | 12,879 bytes | Haunted dark theme, fog, candle-glow headings, blood-red/ghost-green change colours, `prefers-reduced-motion`, mobile `@media (max-width: 480px)` |
| `data.js` | 8,699 bytes | 6 dead coins, 10-coin fallback prices, fallback Fear & Greed (13, Extreme Fear), `fearGreedBand`, `formatPrice`, `formatChange` |
| `app.js` | 10,076 bytes | Live fetches (CoinGecko, alternative.me, 8 s timeout), offline fallback rendering, gauge, tombstone cards with filters + expand, watchlist with localStorage (`graveyard-watchlist-v1`) |
| `tests/test_data.js` | 3,355 bytes | Node unit tests: data integrity, band boundaries, formatting, fallbacks |
| `tests/e2e.js` | 5,748 bytes | Playwright tests: sections render, zero errors, tombstone expand, watchlist persistence, offline labels |

The app is fully static — no build step, no server code, no API keys.
`node_modules/` (Playwright, 19 MB) is a local test dependency only and
must not be committed to the repo. No `.gitignore` exists yet; when the
repo is published, exclude `node_modules/` — and never add `.kiro/` to
a `.gitignore` (the Kiroween rules require it at the repo root).

## Hooks, agents, MCP

- **None.** No Kiro hooks, no sub-agents, no MCP servers were used.
  Kiro worked from the spec/steering files and shell commands only.

## Tests — results (verified independently, not just Kiro's word)

- `node tests/test_data.js` — **86/86 PASS, 0 failed, exit 0**
  (6 dead-coin entries with all fields, BitConnect peak 463, band
  boundaries 0–24 / 25–49 / 50–54 / 55–74 / 75–100, formatting,
  10-coin fallback prices, fallback Fear & Greed value 13).
- `node tests/e2e.js` — **17/17 PASS, 0 failed, exit 0**
  (all 5 sections render, zero console/page errors after filtering the
  two expected failed API fetches — see below, offline labels present,
  tombstone expands on click, watch button persists to localStorage
  and renders a watchlist row).

## Independent verification (headless Chromium, Playwright)

- Page loads with all sections: gauge shows **13 / Extreme Fear**,
  prices table renders **10 rows** (Bitcoin $60,071.00, +0.39% first),
  **6 tombstone cards**, watchlist empty state, footer with CoinGecko
  and alternative.me attribution + educational-only disclaimer.
- **Offline fallback confirmed twice**: (1) in the sandbox the browser
  proxy blocks both API hosts, and the page shows
  "Offline snapshot — live data unavailable (snapshot: 2026-11-25)"
  on both the gauge and prices; (2) with the two API hosts explicitly
  route-blocked, both offline labels appear.
- **Mobile 360 px: 0 px horizontal overflow.**
- Screenshots in `screenshots/`: full page, viewport, each section,
  offline-blocked load, mobile 360 px.

## Problems encountered during the build

- **Flaky backend connection (17 sessions).** Kiro's chat backend
  repeatedly dropped with
  `Error: Your connection was interrupted … (code -32000):
  {"errorType":"ServerConnectionResetError","retryErrorType":"TRANSIENT"}`.
  Each time the session was resumed with `--resume`; all progress
  survived on disk and the build continued. The CLI's file-write tool
  also aborted frequently, so Kiro adapted to appending code in small
  chunks via `python -c`, `printf`, and temp scripts.
- **One credit-consumption throttle.** A single HTTP 429
  `ThrottlingException`, reason `CREDIT_CONSUMPTION_RATE_EXCEEDED`,
  `retryAfterMilliseconds: 300000`. The session waited out the
  5-minute window and continued. Credits were **not** exhausted and
  no quota error stopped the work.
- **Sandbox proxy blocks the APIs in the browser.** `curl` from this
  machine returns HTTP 200 for both the CoinGecko markets endpoint and
  the alternative.me Fear & Greed endpoint, but the sandboxed Chromium
  proxy fails both fetches with `net::ERR_TUNNEL_CONNECTION_FAILED`.
  That is why the browser always exercises the offline-fallback path
  here; on a normal connection the live data loads. The e2e test
  filters exactly those two expected failed-resource console messages
  and asserts the offline labels render instead — it still fails on
  any other console error or any page error.

## Minor observations (not blockers)

- In offline mode the `#prices-updated` "last updated" line is left
  empty by design; the snapshot date is shown in the offline status
  label instead, so the date is always visible.
- `renderPrices` re-attaches its tbody click listener on every call;
  it is called once at startup, so this has no visible effect.
- Gauge band end-labels ("Extreme Fear" / "Extreme Greed") sit tight
  against the arc ends at 1280 px — cosmetic only.
