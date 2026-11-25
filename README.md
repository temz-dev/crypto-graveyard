# Crypto Graveyard

A haunted crypto market dashboard — live prices, a Fear & Greed meter, and the tombstones of the coins that didn't make it. Built for **Kiroween 2026 (Costume Contest)**.

## What it does

- **Live prices** for the top 10 coins (CoinGecko public markets API, keyless), green up / blood-red down.
- **Fear & Greed meter** as a haunted gauge (alternative.me Fear & Greed Index, keyless).
- **The Graveyard**: six dead or rugged coins as clickable tombstones — RIP date, peak price, cause of death, story and one lesson each. Filterable by cause (ponzi / depeg / rug / exchange).
- **Watchlist** saved in your browser (localStorage).

## Run it

Open `index.html` in a browser, or serve it locally:

```sh
python3 -m http.server 8000
```

then visit http://localhost:8000. No build step, no API keys. When live data is unavailable, the app shows a clearly labelled offline snapshot dated 2026-11-25 instead of pretending to be live.

## The dead coins

Every fact in the Graveyard was verified against at least two sources — see `data.js` for the references. Educational only — not financial advice.

## Built with Kiro

Built with Kiro CLI through spec-driven development: requirements, design and tasks live in `.kiro/specs/crypto-graveyard/`, steering docs in `.kiro/steering/`. See `KIRO_USAGE.md` for exactly how Kiro was used.

## Tests

```sh
node tests/test_data.js   # unit tests
node tests/e2e.js         # Playwright end-to-end tests
```
