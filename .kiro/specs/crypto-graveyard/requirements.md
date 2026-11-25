# Requirements Document — Crypto Graveyard

## Introduction

Crypto Graveyard is a haunted crypto market dashboard for the Kiroween 2026 Costume Contest. It shows live prices for the top cryptocurrencies, a Fear & Greed meter styled as a haunted gauge, and a "graveyard" of dead and rugged coins presented as tombstones — each with its RIP date, how it died, and the lesson it teaches. The spooky design is functional: the graveyard is the lesson, and the fear/greed gauge reads like a possessed instrument. The app is a static single-page web app (HTML, CSS, JavaScript, no build step, no server) so it can be hosted on GitHub Pages.

## Glossary

- **Graveyard**: the section listing dead coins as tombstones.
- **Dead coin**: a cryptocurrency that collapsed to near-zero, was rugged, or was shut down as a fraud.
- **Fear & Greed meter**: a 0–100 market sentiment gauge (0 = Extreme Fear, 100 = Extreme Greed).
- **Watchlist**: the user's own list of coins to track, stored in the browser.
- **Live data**: prices fetched from public, keyless APIs at load time.
- **Offline fallback**: static snapshot data used when the network is unavailable, labelled in the UI.

## Requirements

### Requirement 1: Live prices

**User Story:** As a crypto holder, I want to see current prices for the top coins, so I know what the market is doing right now.

#### Acceptance Criteria

1. WHEN the app loads, THE Crypto_Graveyard SHALL fetch current USD prices and 24h change for the top 10 coins by market cap from the CoinGecko public markets API.
2. WHEN the fetch succeeds, THE Crypto_Graveyard SHALL display each coin with its name, symbol, price, and 24h change, green for up and red for down.
3. WHEN the fetch fails or times out, THE Crypto_Graveyard SHALL display a clearly labelled static snapshot with the date it was taken and a "live data unavailable" note.
4. WHEN prices are displayed, THE Crypto_Graveyard SHALL show a "last updated" time.

### Requirement 2: Fear & Greed meter

**User Story:** As a trader, I want a quick read on market sentiment, so I can tell at a glance whether the market is fearful or greedy.

#### Acceptance Criteria

1. WHEN the app loads, THE Crypto_Graveyard SHALL fetch the current Fear & Greed Index value (0–100) and its label from the alternative.me public API.
2. WHEN the value is displayed, THE Crypto_Graveyard SHALL render it as a semicircular haunted gauge with a needle, coloured from blood-red (Extreme Fear) through orange to ghost-green (Extreme Greed).
3. WHEN the fetch fails, THE Crypto_Graveyard SHALL display the gauge with the last known snapshot value and a label saying the live value is unavailable.
4. THE Crypto_Graveyard SHALL show the five sentiment bands: Extreme Fear (0–24), Fear (25–49), Neutral (50–54), Greed (55–74), Extreme Greed (75–100).

### Requirement 3: The Graveyard

**User Story:** As a crypto learner, I want to see famous dead coins and how they died, so I can recognise the same patterns before they cost me money.

#### Acceptance Criteria

1. THE Crypto_Graveyard SHALL list at least 6 dead coins as tombstones, each showing the coin name, symbol, RIP date, peak price, cause of death, and one lesson.
2. WHEN a user clicks a tombstone, THE Crypto_Graveyard SHALL expand it to show the full story (2–4 sentences) and the lesson.
3. THE Crypto_Graveyard SHALL include at least one coin per death type: Ponzi/fraud, depeg/collapse, rug pull, and exchange failure.
4. THE Crypto_Graveyard SHALL let the user filter tombstones by cause of death.
5. All RIP dates, peak prices, and causes of death SHALL be real, verifiable facts, each recorded with a source note in the data file.

### Requirement 4: Watchlist

**User Story:** As a holder, I want to track my own coins, so I can see my holdings in one haunted place.

#### Acceptance Criteria

1. WHEN the user adds a coin from the top-10 list to the watchlist, THE Crypto_Graveyard SHALL persist it in browser localStorage.
2. WHEN the app loads, THE Crypto_Graveyard SHALL restore the saved watchlist.
3. WHEN the user removes a coin from the watchlist, THE Crypto_Graveyard SHALL remove it from localStorage.
4. THE Crypto_Graveyard SHALL show each watchlisted coin with its live price and 24h change, or the offline snapshot label when live data is unavailable.

### Requirement 5: Haunted design (Costume Contest)

**User Story:** As a judge, I want the spooky design to be polished and to make the app better, not just decorated, so the costume is part of the product.

#### Acceptance Criteria

1. THE Crypto_Graveyard SHALL use a dark haunted visual system throughout: near-black background, fog, full moon, orange and purple accents, tombstone cards, flickering candle glow on section headings.
2. WHEN a coin's 24h change is negative, THE Crypto_Graveyard SHALL style it as "bleeding" (blood-red) and positive as "ghost-green", consistent across prices, watchlist, and graveyard.
3. THE Crypto_Graveyard SHALL remain fully readable and usable with animations disabled (prefers-reduced-motion respected).
4. THE Crypto_Graveyard SHALL work on mobile widths (down to 360px) without horizontal scrolling.
5. THE Crypto_Graveyard SHALL NOT use any copyrighted images, music, or third-party trademarks in its design.

### Requirement 6: Honesty and transparency

**User Story:** As a user, I want to know what is live data and what is a snapshot, so I never mistake stale numbers for the market.

#### Acceptance Criteria

1. WHEN live data is unavailable, THE Crypto_Graveyard SHALL label the affected section "offline snapshot" with the snapshot date.
2. THE Crypto_Graveyard SHALL state in the footer that prices come from CoinGecko and sentiment from alternative.me, and that the app is educational, not financial advice.
3. THE Crypto_Graveyard SHALL NOT invent prices, index values, or death facts; every static figure SHALL be traceable to its source note.
