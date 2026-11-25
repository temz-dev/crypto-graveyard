# Tech Steering — Crypto Graveyard

## Stack

- Static single-page app: HTML, CSS, vanilla JavaScript. No build step, no server, no framework.
- `data.js` is UMD: the same file loads in the browser and in Node for tests.
- Public keyless APIs only: CoinGecko markets endpoint for prices, alternative.me for Fear & Greed. Both with 8s timeouts and labelled offline fallbacks.
- Tests: Node unit tests (`tests/test_data.js`) plus a Playwright end-to-end test (`tests/e2e.js`, headless Chromium). Both suites must pass with zero console errors.

## Rules

- Never add a dependency that needs a build step or an API key.
- Never put the `/.kiro` directory in `.gitignore` — the Kiroween rules require it at the repo root.
- Keep the repo clean: no `node_modules/`, no video files, no build intermediates in the submitted repo.
- Verify every static fact (RIP dates, peak prices, causes of death) against a source and record it in `data.js`.
