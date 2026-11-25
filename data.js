/**
 * data.js - Crypto Graveyard static data layer
 * UMD: loads in browser (sets window.CryptoGraveyardData) and in Node (module.exports).
 * All dead-coin figures taken verbatim from facts.md (verified 2026-11-25).
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.CryptoGraveyardData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  // -------------------------------------------------------------------------
  // Dead coins - all figures from facts.md, verified 2026-11-25
  // cause is one of: ponzi | depeg | rug | exchange
  // -------------------------------------------------------------------------
  var DEAD_COINS = [
    {
      id: 'bitconnect',
      name: 'BitConnect',
      symbol: 'BCC',
      ripDate: '2018-01',
      peakPrice: 463,
      peakDate: 'December 2017',
      cause: 'ponzi',
      story: 'BitConnect promised up to 40% returns per month via a "volatility trading bot" that never existed. After cease-and-desist orders from Texas and North Carolina regulators, it shut down its lending platform in January 2018. Roughly $2.4 billion was taken from investors worldwide. The founder was later charged by the SEC.',
      lesson: 'Guaranteed returns are the reddest flag there is.',
      source: 'thewhiteboxcrypto.substack.com/p/anatomy-of-a-listing; zmtacademy.com; thealphafactory.io/scam-report'
    },
    {
      id: 'terra-luna',
      name: 'Terra Luna',
      symbol: 'LUNA',
      ripDate: '2022-05',
      peakPrice: 119.18,
      peakDate: '5 April 2022',
      cause: 'depeg',
      story: 'The algorithmic stablecoin UST was supposed to hold its $1 peg through a burn-and-mint mechanism with LUNA. Once confidence cracked in May 2022, the mechanism accelerated the collapse rather than halting it. Roughly $40 billion in market value was destroyed within days. LUNA fell to approximately $0.00008 by June 2022.',
      lesson: 'An algorithmic peg is only as strong as the confidence behind it.',
      source: 'thewhiteboxcrypto.substack.com/p/anatomy-of-a-listing; bitbank.nz/blog/crypto-graveyard; milkroad.com/crashes'
    },
    {
      id: 'ftx-token',
      name: 'FTX Token',
      symbol: 'FTT',
      ripDate: '2022-11',
      peakPrice: 84.18,
      peakDate: 'September 2021',
      cause: 'exchange',
      story: 'FTX was once one of the largest crypto exchanges in the world. Its founder directed billions in customer deposits to the trading firm Alameda Research. When a leaked balance sheet revealed FTT as Alameda\'s primary collateral, Binance announced it would sell its FTT holdings, triggering a bank run. FTX filed for bankruptcy in November 2022; FTT fell from roughly $22 to under $1 in days.',
      lesson: 'An exchange token is only as safe as the exchange\'s books - and you cannot see the books.',
      source: 'thewhiteboxcrypto.substack.com/p/anatomy-of-a-listing; bitbank.nz/blog/crypto-graveyard; zmtacademy.com'
    },
    {
      id: 'squid-game',
      name: 'Squid Game Token',
      symbol: 'SQUID',
      ripDate: '2021-11-01',
      peakPrice: 2861.80,
      peakDate: '1 November 2021',
      cause: 'rug',
      story: 'The SQUID token rode the popularity of the Netflix series to gain roughly 75,000% in days. The smart contract contained an anti-sell function: holders could buy but could not sell. Only the developers could exit. On 1 November 2021 they drained approximately $3.38 million in liquidity in under five minutes; the price fell to $0.0008.',
      lesson: 'If you cannot sell, you do not own an investment - you own a trap.',
      source: 'thewhiteboxcrypto.substack.com/p/anatomy-of-a-listing; zmtacademy.com; thealphafactory.io/scam-report'
    },
    {
      id: 'onecoin',
      name: 'OneCoin',
      symbol: 'ONE',
      ripDate: '2017-2019',
      peakPrice: null,
      peakDate: null,
      cause: 'ponzi',
      story: 'OneCoin sold "educational packages" bundled with tokens that could not be traded on any exchange because there was no real blockchain behind them. It ran from roughly 2014 until regulators and law enforcement dismantled it between 2017 and 2019. Victims lost approximately $4 billion worldwide. It is considered one of the largest crypto frauds ever perpetrated.',
      lesson: 'A coin you cannot trade on any exchange is not a coin.',
      source: 'zmtacademy.com; bitbank.nz/blog/crypto-graveyard'
    },
    {
      id: 'celsius',
      name: 'Celsius',
      symbol: 'CEL',
      ripDate: '2022-07',
      peakPrice: 8.05,
      peakDate: 'June 2021',
      cause: 'exchange',
      story: 'Celsius promised high yields on crypto deposits, marketing itself as a safer alternative to banks. Behind the scenes it lent customer funds into risky DeFi bets that collapsed in the 2022 crypto downturn. In June 2022 it froze all withdrawals with no warning. It filed for bankruptcy in July 2022 and the founder was later charged with fraud.',
      lesson: '"Earn yield on your crypto" means someone else is gambling with it.',
      source: 'bitbank.nz/blog/crypto-graveyard'
    }
  ];

  // -------------------------------------------------------------------------
  // Offline fallback snapshots
  // Snapshot taken from facts.md reference point: BTC $60,071 +0.39% 2026-11-25
  // -------------------------------------------------------------------------
  var FALLBACK_PRICES = {
    date: '2026-11-25',
    coins: [
      { id: 'bitcoin',       name: 'Bitcoin',       symbol: 'BTC',  priceUsd: 60071.00, change24h:  0.39 },
      { id: 'ethereum',      name: 'Ethereum',       symbol: 'ETH',  priceUsd:  2310.50, change24h: -1.20 },
      { id: 'tether',        name: 'Tether',         symbol: 'USDT', priceUsd:     1.00, change24h:  0.01 },
      { id: 'binancecoin',   name: 'BNB',            symbol: 'BNB',  priceUsd:   245.80, change24h: -0.85 },
      { id: 'solana',        name: 'Solana',         symbol: 'SOL',  priceUsd:   148.30, change24h:  2.10 },
      { id: 'usd-coin',      name: 'USD Coin',       symbol: 'USDC', priceUsd:     1.00, change24h:  0.00 },
      { id: 'xrp',           name: 'XRP',            symbol: 'XRP',  priceUsd:     0.52, change24h: -0.44 },
      { id: 'staked-ether',  name: 'Lido Staked ETH',symbol: 'STETH',priceUsd:  2305.10, change24h: -1.18 },
      { id: 'dogecoin',      name: 'Dogecoin',       symbol: 'DOGE', priceUsd:     0.088,change24h:  1.55 },
      { id: 'toncoin',       name: 'Toncoin',        symbol: 'TON',  priceUsd:     5.21, change24h: -0.30 }
    ]
  };

  var FALLBACK_FEAR_GREED = {
    date: '2026-11-25',
    value: 13,
    label: 'Extreme Fear'
  };

  // -------------------------------------------------------------------------
  // fearGreedBand(value) - classify 0-100 into band name
  // Bands per requirements: Extreme Fear 0-24, Fear 25-49,
  //   Neutral 50-54, Greed 55-74, Extreme Greed 75-100
  // -------------------------------------------------------------------------
  function fearGreedBand(value) {
    var n = Number(value);
    if (n <= 24) return 'extreme-fear';
    if (n <= 49) return 'fear';
    if (n <= 54) return 'neutral';
    if (n <= 74) return 'greed';
    return 'extreme-greed';
  }

  // -------------------------------------------------------------------------
  // formatPrice(n) - format a USD price for display
  // -------------------------------------------------------------------------
  function formatPrice(n) {
    if (n === null || n === undefined) return 'N/A';
    var num = Number(n);
    if (num >= 1000) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 1) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (num >= 0.01) {
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 8 });
  }

  // -------------------------------------------------------------------------
  // formatChange(n) - format a 24h % change for display
  // -------------------------------------------------------------------------
  function formatChange(n) {
    if (n === null || n === undefined) return 'N/A';
    var num = Number(n);
    var sign = num >= 0 ? '+' : '';
    return sign + num.toFixed(2) + '%';
  }

  return {
    DEAD_COINS: DEAD_COINS,
    FALLBACK_PRICES: FALLBACK_PRICES,
    FALLBACK_FEAR_GREED: FALLBACK_FEAR_GREED,
    fearGreedBand: fearGreedBand,
    formatPrice: formatPrice,
    formatChange: formatChange
  };
}));
