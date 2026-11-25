/* app.js - Crypto Graveyard: fetch, render, watchlist, filters */
/* Depends on window.CryptoGraveyardData from data.js */

(function () {
  var D = window.CryptoGraveyardData;
  var WATCHLIST_KEY = "graveyard-watchlist-v1";
  var watchlist = [];
  var priceMap = {};
  var isOfflinePrices = false;
  function qs(sel) { return document.querySelector(sel); }
  function fetchWithTimeout(url, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function(){ ctrl.abort(); }, ms);
    return fetch(url, {signal:ctrl.signal}).then(function(r){ clearTimeout(t); return r; }).catch(function(e){ clearTimeout(t); throw e; });
  }

  /* ---- Watchlist persistence ---- */
  function loadWatchlist() {
    try { watchlist = JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || []; }
    catch(e) { watchlist = []; }
  }
  function saveWatchlist() {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
  function isWatched(id) { return watchlist.indexOf(id) !== -1; }
  function addToWatchlist(id) {
    if (!isWatched(id)) { watchlist.push(id); saveWatchlist(); renderWatchlist(); refreshWatchButtons(); }
  }
  function removeFromWatchlist(id) {
    watchlist = watchlist.filter(function(x){ return x !== id; });
    saveWatchlist(); renderWatchlist(); refreshWatchButtons();
  }

  /* ---- Fear & Greed fetch + render ---- */
  function fetchFearGreed() {
    return fetchWithTimeout("https://api.alternative.me/fng/?limit=1", 8000)
      .then(function(r){ return r.json(); })
      .then(function(json){
        var val = parseInt(json.data[0].value, 10);
        var label = json.data[0].value_classification;
        renderGauge(val, label, false);
      })
      .catch(function(){
        var fb = D.FALLBACK_FEAR_GREED;
        renderGauge(fb.value, fb.label, true);
      });
  }

  function renderGauge(value, label, offline) {
    var band = D.fearGreedBand(value);
    var angle = -90 + (value / 100) * 180;
    var ng = document.getElementById("gauge-needle-group");
    if (ng) ng.setAttribute("transform", "rotate("+angle+", 150, 150)");
    var gv = document.getElementById("gauge-value");
    if (gv) gv.textContent = value;
    var gl = document.getElementById("gauge-band-label");
    if (gl) { gl.textContent = label; gl.className = "gauge-band-label " + band; }
    var gs = document.getElementById("gauge-status");
    if (gs) {
      if (offline) { gs.textContent = "Offline snapshot - live value unavailable (snapshot: " + D.FALLBACK_FEAR_GREED.date + ")"; gs.className = "data-status offline"; }
      else { gs.textContent = ""; gs.className = "data-status"; }
    }
  }

  /* ---- Prices fetch ---- */
  function fetchPrices() {
    var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    return fetchWithTimeout(url, 8000)
      .then(function(r){ return r.json(); })
      .then(function(json){
        var coins = json.map(function(c){
          return {id:c.id, name:c.name, symbol:c.symbol.toUpperCase(), priceUsd:c.current_price, change24h:c.price_change_percentage_24h};
        });
        isOfflinePrices = false;
        renderPrices(coins, false);
      })
      .catch(function(){
        isOfflinePrices = true;
        renderPrices(D.FALLBACK_PRICES.coins, true);
      });
  }

  /* ---- Helpers ---- */
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function nowTime() {
    return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  }
  function refreshWatchButtons() {
    document.querySelectorAll('.btn-watch').forEach(function(btn){
      var id = btn.dataset.coinId;
      var w = isWatched(id);
      btn.textContent = w ? 'Watching' : '+ Watch';
      btn.classList.toggle('watching', w);
    });
  }

  /* ---- renderPrices ---- */
  function renderPrices(coins, offline) {
    priceMap = {};
    coins.forEach(function(c){ priceMap[c.id] = c; });
    var tbody = document.getElementById("prices-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    coins.forEach(function(c, i){
      var chg = c.change24h;
      var cls = chg > 0 ? "change-up" : chg < 0 ? "change-down" : "change-flat";
      var w = isWatched(c.id);
      var tr = document.createElement("tr");
      tr.dataset.coinId = c.id;
      var btn = w ? "Watching" : "+ Watch";
      var bCls = w ? "btn-watch watching" : "btn-watch";
      tr.innerHTML =
        "<td class=\"coin-rank\">"+(i+1)+"</td>"
        +"<td><span class=\"coin-name-cell\"><span>"+escHtml(c.name)+"</span>"
        +"<span class=\"coin-symbol\">"+escHtml(c.symbol)+"</span></span></td>"
        +"<td class=\"coin-price\">"+escHtml(D.formatPrice(c.priceUsd))+"</td>"
        +"<td><span class=\"change-chip "+cls+"\">"+escHtml(D.formatChange(chg))+"</span></td>"
        +"<td><button class=\""+bCls+"\" data-coin-id=\""+c.id+"\">"+btn+"</button></td>";
      tbody.appendChild(tr);
    });
    var status = document.getElementById("prices-status");
    if (status) {
      if (offline) {
        status.textContent = "Offline snapshot \u2014 live data unavailable (snapshot: "+D.FALLBACK_PRICES.date+")";
        status.className = "data-status offline";
      } else { status.textContent = ""; status.className = "data-status"; }
    }
    var upd = document.getElementById("prices-updated");
    if (upd) upd.textContent = offline ? "" : "Last updated: "+nowTime();
    refreshWatchButtons();
    document.getElementById("prices-tbody").addEventListener("click", function(e){
      var btn = e.target.closest(".btn-watch");
      if (!btn) return;
      var id = btn.dataset.coinId;
      if (isWatched(id)) { removeFromWatchlist(id); } else { addToWatchlist(id); }
    });
  }

  /* ---- renderGraveyard ---- */
  var CAUSE_LABEL = {ponzi:"Ponzi/Fraud",depeg:"Depeg/Collapse",rug:"Rug Pull",exchange:"Exchange Failure"};
  function renderGraveyard() {
    var grid = document.getElementById("graveyard-grid");
    if (!grid) return;
    grid.innerHTML = "";
    D.DEAD_COINS.forEach(function(coin){
      var peak = coin.peakPrice ? D.formatPrice(coin.peakPrice)+" ("+coin.peakDate+")" : "No public market";
      var card = document.createElement("article");
      card.className = "tombstone";
      card.dataset.cause = coin.cause;
      card.setAttribute("aria-expanded","false");
      card.setAttribute("tabindex","0");
      card.setAttribute("role","button");
      card.setAttribute("aria-label",coin.name+" tombstone");
      card.innerHTML =
        '<div class="tombstone-name">' + escHtml(coin.name) + '</div>'
        + '<div class="tombstone-symbol">' + escHtml(coin.symbol) + '</div>'
        + '<div class="tombstone-rip">RIP ' + escHtml(coin.ripDate) + '</div>'
        + '<div class="tombstone-peak">Peak: ' + escHtml(peak) + '</div>'
        + '<span class="tombstone-cause cause-' + coin.cause + '">' + escHtml(CAUSE_LABEL[coin.cause]) + '</span>'
        + '<div class="tombstone-expand-hint">Click to unearth…</div>'
        + '<div class="tombstone-story"><p>' + escHtml(coin.story) + '</p>'
        + '<div class="tombstone-lesson">💡 ' + escHtml(coin.lesson) + '</div>'
        + '<div class="tombstone-source">Source: ' + escHtml(coin.source) + '</div></div>';
      function toggle(e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        var exp = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', exp ? 'false' : 'true');
      }
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', toggle);
      grid.appendChild(card);
    });
    document.querySelectorAll('.chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        document.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('chip-active'); });
        chip.classList.add('chip-active');
        var filter = chip.dataset.filter;
        document.querySelectorAll('.tombstone').forEach(function(card){
          if (filter === 'all' || card.dataset.cause === filter) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden','');
          }
        });
      });
    });
  }

  /* ---- renderWatchlist ---- */
  function renderWatchlist() {
    var empty = document.getElementById("watchlist-empty");
    var table = document.getElementById("watchlist-table");
    var tbody = document.getElementById("watchlist-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (watchlist.length === 0) {
      if (empty) empty.style.display = "";
      if (table) table.hidden = true;
      return;
    }
    if (empty) empty.style.display = "none";
    if (table) table.hidden = false;
    var src = Object.keys(priceMap).length ? priceMap : (function(){
      var m = {};
      D.FALLBACK_PRICES.coins.forEach(function(c){ m[c.id] = c; });
      return m;
    }());
    watchlist.forEach(function(id){
      var c = src[id];
      if (!c) return;
      var chg = c.change24h;
      var cls = chg>0?"change-up":chg<0?"change-down":"change-flat";
      var tr = document.createElement("tr");
      var n="<td><span class='coin-name-cell'><span>"+escHtml(c.name)+"</span><span class='coin-symbol'>"+escHtml(c.symbol)+"</span></span></td>";
      var p="<td class='coin-price'>"+escHtml(D.formatPrice(c.priceUsd))+"</td>";
      var g="<td><span class='change-chip "+cls+"'>"+escHtml(D.formatChange(chg))+"</span></td>";
      var r="<td><button class='btn-remove' data-coin-id='"+c.id+"'>Remove</button></td>";
      tr.innerHTML=n+p+g+r;
      tbody.appendChild(tr);
    });
    tbody.addEventListener("click",function(e){
      var btn=e.target.closest(".btn-remove");
      if (btn){removeFromWatchlist(btn.dataset.coinId);}
    });
  }

  /* ---- init ---- */
  function init() {
    loadWatchlist();
    renderGraveyard();
    renderWatchlist();
    fetchFearGreed();
    fetchPrices();
  }

  document.addEventListener("DOMContentLoaded", init);

}());
