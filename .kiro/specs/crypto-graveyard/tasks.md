# Implementation Plan — Crypto Graveyard

- [x] 1. Set up the project skeleton
  - Create `index.html`, `styles.css`, `app.js`, `data.js` with the haunted layout shell: header (title, moon), Fear & Greed gauge section, live prices section, graveyard grid, watchlist, footer
  - Verify the page loads with no console errors and all sections present
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 2. Implement the graveyard data and rendering
  - Write `data.js` with 6 dead-coin entries (BitConnect, Terra Luna, FTX Token, Squid Game, OneCoin, plus one more), each with name, symbol, RIP date, peak price, cause, story, lesson, and source note
  - Render tombstone cards; click expands the story; add filter chips by cause of death
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 6.3_

- [x] 3. Implement live prices with offline fallback
  - Fetch top 10 from CoinGecko in `app.js` with an 8s timeout; render rows with price and 24h change
  - On failure, render the `FALLBACK_PRICES` snapshot with an "offline snapshot" label and its date
  - Show "last updated" time in both cases
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1_

- [x] 4. Implement the Fear & Greed gauge
  - Fetch the index from alternative.me with an 8s timeout; render the SVG semicircle gauge with needle and five bands
  - On failure, render the `FALLBACK_FEAR_GREED` snapshot with an offline label
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1_

- [x] 5. Implement the watchlist
  - Add/remove buttons on price rows; persist to localStorage under `graveyard-watchlist-v1`; restore on load
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 6. Implement the haunted visual system
  - Dark theme, fog, full moon, tombstone cards, candle-glow headings, blood-red/ghost-green change colours
  - Respect `prefers-reduced-motion`; verify mobile widths down to 360px with no horizontal scrolling
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7. Add footer honesty labels and write tests
  - Footer: data sources (CoinGecko, alternative.me), snapshot labelling, educational-only disclaimer
  - Write `tests/test_data.js` (data integrity, band boundaries, formatting) and `tests/e2e.js` (Playwright: sections render, zero console errors, tombstone expand, watchlist persistence)
  - Run both suites; all tests must pass
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. Verify the full app
  - Load the page in headless Chromium, capture screenshots of all sections, and check the gauge, prices, graveyard, and watchlist visually
  - Load with network blocked and confirm both offline labels appear
  - _Requirements: 1.3, 2.3, 5.1_
