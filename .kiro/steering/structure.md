# Structure Steering — Crypto Graveyard

```
crypto-graveyard/
  index.html        # page structure
  styles.css        # haunted visual system
  app.js            # fetch, render, watchlist, filters
  data.js           # dead coins + offline snapshots (UMD)
  tests/
    test_data.js    # unit tests
    e2e.js          # Playwright end-to-end test
  .kiro/
    specs/crypto-graveyard/
      requirements.md
      design.md
      tasks.md
    steering/
      product.md
      tech.md
      structure.md
```

- One responsibility per file. `app.js` never holds static facts; `data.js` never touches the DOM.
- Every user-visible string lives in the HTML/JS, not buried in CSS.
- Screenshots and the demo video live outside the repo until submission packaging, then under `screenshots/` if the repo needs them.
